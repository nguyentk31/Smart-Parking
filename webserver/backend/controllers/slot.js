const Slot = require("../models/slot");
const Area = require("../models/area");

exports.getSlots = async (_req, res) => {
  try {
    const slots = await Slot.find();

    res.status(200).json({
      status: "success",
      results: slots.length,
      slots,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

exports.getSlotsByArea = async (req, res) => {
  try {
    let area;
    if (req.params.areaId.match(/^[0-9a-fA-F]{24}$/)) {
      area = await Area.findById(req.params.areaId);
    }

    if (!area) {
      throw new Error("Area not found!");
    }

    const slots = await Slot.find({ area: req.params.areaId });

    res.status(200).json({
      status: "success",
      slots,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

exports.getSlotById = async (req, res) => {
  try {
    let slot;
    if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      slot = await Slot.findById(req.params.id);
    }

    if (!slot) {
      throw new Error("Slot not found!");
    }

    res.status(200).json({
      status: "success",
      slot,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

// exports.updateSlot = async (req, res) => {
//   try {
//     const slot = await Slot.findOne({ name: req.body.slot });
//     const { isParking } = req.body;

//     if (!slot) {
//       throw new Error("Slot not found!");
//     }

//     if (isParking) {
//       slot.status = "unavailable";
//     } else {
//       slot.status = "available";
//     }

//     await slot.save();

//     res.status(200).json({
//       status: "success",
//       message: "Slot updated successfully!",
//     });
//   } catch (error) {
//     res.status(400).json({
//       status: "error",
//       message: error.message,
//     });
//   }
// };
