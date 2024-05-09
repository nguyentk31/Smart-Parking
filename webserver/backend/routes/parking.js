const express = require("express");
const parkingController = require("../controllers/parking");

const router = express.Router();

// router.post(
//   parkingController.uploadImageParking,
//   parkingController.getImageParking,
//   parkingController.createOrUpdateParking
// );

// router.patch("/updateParkingSlot", parkingController.updateParkingSlot);
router.get("/", parkingController.getParkings);
router.get("/:id", parkingController.getParking);

module.exports = router;
