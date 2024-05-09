const express = require("express");
const notificationController = require("../controllers/notification");
const authController = require("../controllers/auth");

const router = express.Router();

router.use(authController.protect);

router.get("/", notificationController.getNotifications);
router.get("/:id", notificationController.getNotification);
router.patch("/:id", notificationController.updateNotification);
router.delete("/:id", notificationController.deleteNotification);
router.delete("/", notificationController.deleteAllNotifications);

module.exports = router;
