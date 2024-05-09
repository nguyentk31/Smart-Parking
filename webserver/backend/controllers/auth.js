const crypto = require("crypto");
const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES,
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRES * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    // secure: true
  };
  // if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

  res.cookie("jwt", token, cookieOptions);

  user.password = undefined;
  user.active = undefined;
  user.passwordResetExpires = undefined;
  user.passwordResetToken = undefined;
  user.__v = undefined;

  res.status(statusCode).json({
    status: "success",
    token,
    timeExpire: cookieOptions.expires.getTime(),
    user,
    message: "Login successfully!",
  });
};

exports.register = async (req, res) => {
  try {
    const newUser = await User.create({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
    });

    newUser.password = undefined;
    res.status(201).json({
      status: "success",
      user: newUser,
      message: "User created successfully!",
    });
  } catch (err) {
    if (err.code === 11000) {
      res.status(400).json({
        status: "error",
        message: "Email is already taken! Please use another email.",
      });
    } else {
      res.status(400).json({
        status: "error",
        message: err.message || "Something went wrong! Please try again.",
      });
    }
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new Error("Please provide email and password!");
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await user.correctPassword(password, user.password))) {
      throw new Error("Incorrect email or password");
    }

    createSendToken(user, 200, res);
  } catch (err) {
    res.status(400).json({
      status: "error",
      message: err.message,
    });
  }
};

exports.protect = async (req, res, next) => {
  try {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies.jwt) {
      token = req.cookies.jwt;
    }

    if (!token) {
      throw new Error("You are not logged in! Please log in to get access.");
    }
    const decoded = await promisify(jwt.verify)(
      token,
      process.env.JWT_SECRET_KEY
    );
    const currentUser = await User.findById(decoded.id);

    if (!currentUser) {
      throw new Error("The user belonging to this token does no longer exist.");
    }

    if (currentUser.changedPasswordAfter(decoded.iat)) {
      throw new Error("User recently changed password! Please log in again.");
    }

    req.user = currentUser;
    next();
  } catch (err) {
    res.status(400).json({
      status: "error",
      message: err.message,
    });
  }
};

exports.logout = (_req, res) => {
  res.cookie("jwt", "loggedOut", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({ status: "success" });
};

exports.updatePassword = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("+password");
    if (
      !(await user.correctPassword(req.body.passwordCurrent, user.password))
    ) {
      throw new Error("Your current password is wrong");
    }

    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    await user.save();
    createSendToken(user, 200, res);
  } catch (err) {
    res.status(400).json({
      status: "error",
      message: err.message,
    });
  }
};

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      res.status(500).json({
        status: "error",
        message: "You do not have permission to perform this action",
      });

      return;
    }
    next();
  };
};
