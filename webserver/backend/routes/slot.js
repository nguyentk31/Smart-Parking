const express = require("express");
const slotController = require("../controllers/slot");
const authController = require("../controllers/auth");

const router = express.Router();

router.get("/", slotController.getSlots);
router.get("/area/:areaId", slotController.getSlotsByArea);
router.get("/:id", slotController.getSlotById);

router.use(authController.protect);

module.exports = router;
