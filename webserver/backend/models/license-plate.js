const mongoose = require("mongoose");

const licensePlateSchema = new mongoose.Schema({
  plate: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
});

licensePlateSchema.pre(/^find/, function (next) {
  this.populate("user");
  next();
});

const LicensePlate = mongoose.model("LicensePlate", licensePlateSchema);

module.exports = LicensePlate;
