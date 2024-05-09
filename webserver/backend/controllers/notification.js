const Notification = require("../models/notification");
const User = require("../models/user");

exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ receiver: req.user._id });

    res.status(200).json({
      status: "success",
      notifications,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

exports.getNotification = async (req, res) => {
  try {
    let notification;
    if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      notification = await Notification.findOne({
        _id: req.params.id,
        receiver: req.user._id,
      });
    }

    if (!notification) {
      throw new Error("Notification not found!");
    }

    res.status(200).json({
      status: "success",
      notification,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

exports.updateNotification = async (req, res) => {
  try {
    let notification;
    if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      notification = await Notification.findOne({
        _id: req.params.id,
        receiver: req.user._id,
      });
    }

    if (!notification) {
      throw new Error("Notification not found!");
    }

    notification.status = "read";

    await notification.save();

    res.status(200).json({
      status: "success",
      notification,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

exports.deleteNotification = async (req, res) => {
  try {
    let notification;
    if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      notification = await Notification.findOne({
        _id: req.params.id,
        receiver: req.user._id,
      });
    }

    if (!notification) {
      throw new Error("Notification not found!");
    }

    const user = await User.findById(req.user._id);

    if (!user.notification.includes(req.params.id)) {
      throw new Error("You are not authorized to delete this notification!");
    }

    await user.updateOne({ $pull: { notification: req.params.id } });

    await notification.deleteOne({
      _id: req.params.id,
      receiver: req.user._id,
    });

    res.status(200).json({
      status: "success",
      data: null,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

exports.deleteAllNotifications = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user.notification.length === 0) {
      throw new Error("You do not have any notifications!");
    }

    await user.updateOne({ $set: { notification: [] } });

    await Notification.deleteMany({ receiver: req.user._id });

    res.status(200).json({
      status: "success",
      data: null,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};
