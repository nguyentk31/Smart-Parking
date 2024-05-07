const mongoose = require("mongoose");

const slotSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide the slot name"],
      unique: true,
    },
    area: {
      type: mongoose.Schema.ObjectId,
      ref: "Area",
      required: true,
    },
    // parking: {
    //   type: mongoose.Schema.ObjectId,
    //   ref: "Parking",
    // },
    status: {
      type: String,
      enum: ["available", "unavailable"],
      default: "available",
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

slotSchema.pre("save", function (next) {
  this.name = this.name.trim().toUpperCase();
  next();
});

slotSchema.pre(/^find/, function (next) {
  this.populate("area");
  next();
});

const Slot = mongoose.model("Slot", slotSchema);

module.exports = Slot;
