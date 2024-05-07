const Area = require("../models/area");
const Slot = require("../models/slot");

exports.getAreas = async (_req, res) => {
  try {
    const areas = await Area.find();

    res.status(200).json({
      status: "success",
      results: areas.length,
      areas,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

exports.getArea = async (req, res) => {
  try {
    let area;
    if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      area = await Area.findById(req.params.id);
    }

    if (!area) {
      throw new Error("Area not found!");
    }

    res.status(200).json({
      status: "success",
      area,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

exports.createArea = async (req, res) => {
  try {
    const newArea = await Area.create(req.body);

    const slots = [];
    for (let i = 1; i <= newArea.slot; i++) {
      slots.push({ name: `${newArea.name}${i}`, area: newArea.id });
    }

    await Slot.create(slots);

    res.status(201).json({
      status: "success",
      area: newArea,
      message: "Area created successfully!",
    });
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({
        status: "error",
        message: "Area name already exists! Please use another name.",
      });
    } else {
      res.status(400).json({
        status: "error",
        message: error.message || "Something went wrong! Please try again.",
      });
    }
  }
};

exports.updateArea = async (req, res) => {
  try {
    const area = await Area.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!area) {
      throw new Error("Area not found!");
    }

    res.status(200).json({
      status: "success",
      area,
      message: "Area updated successfully!",
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

module.exports.deleteArea = async (req, res) => {
  try {
    const area = await Area.findByIdAndDelete(req.params.id);

    if (!area) {
      throw new Error("Area not found!");
    }

    await Slot.deleteMany({ area: req.params.id });

    res.status(200).json({
      status: "success",
      message: "Area deleted successfully!",
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};
