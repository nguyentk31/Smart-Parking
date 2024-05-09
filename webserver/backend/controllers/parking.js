const Parking = require("../models/parking");
const Slot = require("../models/slot");
// const User = require("../models/user");
const cloudinary = require("cloudinary").v2;
const { differenceInHours } = require("date-fns");
const multer = require("multer");
require("dotenv").config({
  path: "../.env",
});

const storage = multer.memoryStorage();
const imageFilter = function (req, file, cb) {
  if (
    !file.originalname.match(
      /\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF|avif|AVIF|webp|WEBP)$/
    )
  ) {
    req.fileValidationError = "Only image files are allowed!";
    return cb(new Error("Only image files are allowed!"), false);
  }
  cb(null, true);
};
const upload = multer({ storage: storage, fileFilter: imageFilter });

exports.uploadImageParking = upload.any();

exports.getImageParking = async (req, res, next) => {
  if (req.fileValidationError) {
    return res.send(req.fileValidationError);
  }
  next();
};

exports.getParkings = async (_req, res) => {
  try {
    const parkings = await Parking.find();

    res.status(200).json({
      status: "success",
      results: parkings.length,
      parkings,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

exports.getParking = async (req, res) => {
  try {
    let parking;
    if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      parking = await Parking.findById(req.params.id);
    }

    if (!parking) {
      throw new Error("Parking not found!");
    }

    res.status(200).json({
      status: "success",
      parking,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

// exports.createOrUpdateParking = async (req, res) => {
//   try {
//     cloudinary.config({
//       cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//       api_key: process.env.CLOUDINARY_API_KEY,
//       api_secret: process.env.CLOUDINARY_API_SECRET,
//     });

//     const { direction, lp_part1, lp_part2 } = req.body;
//     const plate = `${lp_part1}-${lp_part2}`;
//     const parking = await Parking.findOne({ plate, status: "parking" });

//     if (parking) {
//       if (direction === "in") {
//         throw new Error("Parking already exist!");
//       }
//     }

//     if (!parking) {
//       if (direction === "out") {
//         throw new Error("Parking not found!");
//       }
//     }

//     if (req.files) {
//       const uploadPromises = req.files.map((file) => {
//         return new Promise((resolve, reject) => {
//           const { originalname, buffer, fieldname } = file;
//           if (fieldname === "log") {
//             cloudinary.uploader
//               .upload_stream(
//                 {
//                   folder: "parking",
//                   public_id: `${new Date().getTime()}_${
//                     originalname.split(".")[0]
//                   }`,
//                   resource_type: "image",
//                 },
//                 (error, result) => {
//                   if (error) {
//                     console.error(error);
//                     reject(error);
//                   } else {
//                     req.body.image = result.url;
//                     resolve(result);
//                   }
//                 }
//               )
//               .end(buffer);
//           }
//         });
//       });

//       await Promise.all(uploadPromises);
//     }

//     if (direction === "in") {
//       await Parking.create({
//         plate,
//         imageIn: req.body.image,
//         checkIn: new Date(),
//         updateAt: new Date(),
//       });
//     } else {
//       const checkOut = new Date();
//       let hours = differenceInHours(
//         new Date(checkOut),
//         new Date(parking.checkIn)
//       );
//       if (hours <= 0) {
//         hours = 1;
//       }

//       parking.imageOut = req.body.image;
//       parking.checkOut = checkOut;
//       parking.totalPayment = hours * 10;
//       parking.status = "completed";
//       parking.updateAt = new Date();

//       await parking.save();
//     }

//     res.status(201).json({
//       status: "success",
//       message: "Parking check in!",
//     });
//   } catch (error) {
//     res.status(400).json({
//       status: "error",
//       message: error.message,
//     });
//   }
// };

// exports.updateParkingCheckOut = async (req, res) => {
//   try {
//     cloudinary.config({
//       cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//       api_key: process.env.CLOUDINARY_API_KEY,
//       api_secret: process.env.CLOUDINARY_API_SECRET,
//     });

//     const { lp_part1, lp_part2 } = req.body;
//     const plate = `${lp_part1}-${lp_part2}`;
//     const parking = await Parking.findOne({ plate, status: "parking" });

//     if (!parking) {
//       throw new Error("Parking not found!");
//     }

//     if (req.files) {
//       const uploadPromises = req.files.map((file) => {
//         return new Promise((resolve, reject) => {
//           const { originalname, buffer, fieldname } = file;
//           if (fieldname === "log") {
//             cloudinary.uploader
//               .upload_stream(
//                 {
//                   folder: "parking",
//                   public_id: `${new Date().getTime()}_${
//                     originalname.split(".")[0]
//                   }`,
//                   resource_type: "image",
//                 },
//                 (error, result) => {
//                   if (error) {
//                     console.error(error);
//                     reject(error);
//                   } else {
//                     req.body.image = result.url;
//                     resolve(result);
//                   }
//                 }
//               )
//               .end(buffer);

//             console.log(originalname);
//           }
//         });
//       });

//       await Promise.all(uploadPromises);
//     }

//     const checkOut = new Date();
//     let hours = differenceInHours(
//       new Date(checkOut),
//       new Date(parking.checkIn)
//     );

//     if (hours <= 0) {
//       hours = 1;
//     }

//     console.log(hours);

//     const admin = await User.findOne({ role: "admin" });

//     parking.imageOut = req.body.image;
//     parking.checkOut = checkOut;
//     parking.totalPayment = hours * 10;
//     parking.status = "completed";
//     parking.updateAt = new Date();

//     await parking.save();
//     await Slot.findOneAndUpdate(
//       {
//         name: parking.slot,
//       },
//       {
//         parking: null,
//         status: "available",
//       }
//     );
//     const notification = await Notification.create({
//       title: "Parking Payment",
//       description: `${parking.plate} has been paid with total payment ${parking.totalPayment}!`,
//       receiver: admin.id,
//     });

//     await admin.updateOne(
//       { $push: { notification: notification.id } },
//       { runValidators: true }
//     );

//     res.status(201).json({
//       status: "success",
//       message: "Parking check out!",
//     });
//   } catch (error) {
//     res.status(400).json({
//       status: "error",
//       message: error.message,
//     });
//   }
// };

// exports.updateParkingSlot = async (req, res) => {
//   try {
//     const { lp_part1, lp_part2, slot } = req.body;
//     const plate = `${lp_part1}-${lp_part2}`;
//     const parking = await Parking.findOne({
//       plate,
//       status: "parking",
//     });
//     const slotData = await Slot.findOne({ name: slot });
//     // const admin = await User.findOne({ role: "admin" });

//     if (!parking) {
//       throw new Error("Parking not found!");
//     }

//     if (!slotData) {
//       throw new Error("Slot not found!");
//     }

//     if (parking.slot) {
//       throw new Error("Parking already have slot!");
//     }

//     parking.slot = slotData.name;
//     parking.area = slotData.area.name;
//     parking.price = slotData.area.price;
//     parking.status = "parked";
//     parking.updateAt = new Date();

//     await parking.save();
//     await Slot.findByIdAndUpdate(slotData.id, {
//       parking: parking.id,
//       status: "unavailable",
//     });
//     // const notification = await Notification.create({
//     //   title: "Parking Slot",
//     //   description: `${parking.plate} has been parked in ${slotData.name}!`,
//     //   receiver: admin.id,
//     // });

//     // await admin.updateOne(
//     //   { $push: { notification: notification.id } },
//     //   { runValidators: true }
//     // );

//     res.status(201).json({
//       status: "success",
//     });
//   } catch (error) {
//     res.status(400).json({
//       status: "error",
//       message: error.message,
//     });
//   }
// };
