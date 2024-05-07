const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  slot: {
    type: mongoose.Schema.ObjectId,
    ref: "Slot",
    required: true,
  },
  licensePlate: {
    type: mongoose.Schema.ObjectId,
    ref: "LicensePlate",
    required: true,
  },
  checkIn: {
    type: Date,
    default: Date.now(),
  },
  checkOut: {
    type: Date,
  },
  status: {
    type: String,
    enum: ["success", "pending", "failed"],
    default: "pending",
  },
});

bookingSchema.pre(/^find/, function (next) {
  this.populate("user").populate("slot").populate("licensePlate");
  next();
});

const Booking = mongoose.model("Booking", bookingSchema);

module.exports = Booking;
