const mongoose = require("mongoose");

const parkingSchema = new mongoose.Schema(
  {
    plate: {
      type: String,
      required: true,
    },
    imageIn: {
      type: String,
    },
    imageOut: {
      type: String,
    },
    checkIn: {
      type: Date,
    },
    checkOut: {
      type: Date,
    },
    // slot: {
    //   type: String,
    // },
    // area: {
    //   type: String,
    // },
    // price: {
    //   type: Number,
    // },
    totalPayment: {
      type: Number,
      required: true,
      default: 0,
    },
    updateAt: {
      type: Date,
    },
    status: {
      type: String,
      enum: ["parking", "completed", "pending"],
      default: "parking",
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

parkingSchema.pre(/^find/, function (next) {
  this.sort({ updateAt: -1 });
  next();
});

const Parking = mongoose.model("Parking", parkingSchema);

module.exports = Parking;
