const express = require("express");
const areaController = require("../controllers/area");
const authController = require("../controllers/auth");

const router = express.Router();

router.get("/", areaController.getAreas);
router.get("/:id", areaController.getArea);

router.use(authController.protect);

router.post("/", authController.restrictTo("admin"), areaController.createArea);
router.patch(
  "/:id",
  authController.restrictTo("admin"),
  areaController.updateArea
);
router.delete(
  "/:id",
  authController.restrictTo("admin"),
  areaController.deleteArea
);

module.exports = router;
