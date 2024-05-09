const mongoose = require("mongoose");

const areaSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "Please provide the area name"],
      unique: true,
    },
    slot: {
      type: Number,
      required: [true, "Please provide the number of slots"],
    },
    floors: {
      type: Number,
      required: [true, "Please provide the number of floors"],
    },
    price: {
      type: Number,
      required: [true, "Please provide the area price"],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

areaSchema.pre("save", function (next) {
  this.name = this.name.trim().toUpperCase();
  next();
});

const Area = mongoose.model("Area", areaSchema);

module.exports = Area;
