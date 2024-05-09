const User = require("../models/user");
const cloudinary = require("cloudinary").v2;
const multer = require("multer");
require("dotenv").config({
  path: "../.env",
});

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

const storage = multer.memoryStorage();
const imageFilter = function (req, file, cb) {
  if (
    !file.originalname.match(
      /\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF|avif|AVIF|webp|WEBP)$/
    )
  ) {
    req.fileValidationError = "Only image files are allowed!";
    return cb(new Error("Only image files are allowed!"), false);
  }
  cb(null, true);
};
const upload = multer({ storage: storage, fileFilter: imageFilter });

exports.uploadUserPhoto = upload.any();

exports.getMe = (req, _res, next) => {
  req.params.id = req.user.id;
  next();
};

exports.getImageUser = async (req, res, next) => {
  if (req.fileValidationError) {
    return res.send(req.fileValidationError);
  }
  next();
};

exports.updateMe = async (req, res) => {
  try {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    const filteredBody = filterObj(
      req.body,
      "name",
      "email",
      "birthday",
      "gender"
    );

    if (req.files) {
      const uploadPromises = req.files.map((file) => {
        return new Promise((resolve, reject) => {
          const { originalname, buffer, fieldname } = file;
          if (fieldname === "photo") {
            cloudinary.uploader
              .upload_stream(
                {
                  folder: "users",
                  public_id: originalname.split(".")[0],
                  resource_type: "image",
                },
                (error, result) => {
                  if (error) {
                    console.error(error);
                    reject(error);
                  } else {
                    filteredBody.photo = result.url;
                    resolve(result);
                  }
                }
              )
              .end(buffer);
          }
        });
      });

      await Promise.all(uploadPromises);
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      filteredBody,
      {
        new: true,
        runValidators: true,
      }
    );

    updatedUser.passwordResetExpires = undefined;
    updatedUser.passwordResetToken = undefined;
    updatedUser.passwordConfirm = undefined;
    updatedUser.passwordChangedAt = undefined;
    updatedUser.active = undefined;
    updatedUser.__v = undefined;

    res.status(200).json({
      status: "success",
      user: updatedUser,
    });
  } catch (err) {
    res.status(400).json({
      status: "error",
      message: err.message,
    });
  }
};

exports.getUser = async (req, res) => {
  try {
    let user;
    if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      user = await User.findById(req.params.id);
    }

    if (!user) {
      throw new Error("No user found!");
    }

    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    res.status(200).json({
      status: "success",
      user,
    });
  } catch (err) {
    res.status(400).json({
      status: "error",
      message: err.message,
    });
  }
};

exports.getAllUser = async (_req, res) => {
  try {
    const users = await User.find({ role: "user" });

    res.status(200).json({
      status: "success",
      data: {
        length: users.length,
        users,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "error",
      message: err.message,
    });
  }
};
