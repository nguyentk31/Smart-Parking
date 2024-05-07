const express = require("express");
const multer = require("multer");
const mqtt = require("mqtt");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const Slot = require("./models/slot");
const { differenceInHours } = require("date-fns");
const cloudinary = require("cloudinary").v2;
const Area = require("./models/area");
const Parking = require("./models/parking");

dotenv.config({
  path: ".env",
});

const DB = process.env.DATABASE_CLOUD.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

mongoose.connect(DB).then(() => {
  console.log("DB connection successful");
});

const client = mqtt.connect("mqtt://mqtt_broker:1883", {
  clientId: `mqtt_${Math.random().toString(16).slice(3)}`,
  clean: true,
  connectTimeout: 4000,
  username: "iot",
  password: "123456",
  reconnectPeriod: 1000,
});

client.on("connect", () => {
  client.subscribe("test_topic", (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log("mqtt connected!");
    }
    client.on("message", async function (topic, message) {
      try {
        console.log("topic: " + topic);
        const data = JSON.parse(message.toString());
        console.log(data.slot);

        const slot = await Slot.findOne({ name: data.slot });
        if (!slot) {
          throw new Error("Slot not found!");
        }

        if (slot.status === "unavailable") {
          slot.status = "available";
        } else {
          slot.status = "unavailable";
        }

        await slot.save();
      } catch (error) {
        console.log(error);
      }
    });
  });
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

const app = express();
app.use(express.json());
port = 8800;

const getImageParking = async (req, res, next) => {
  if (req.fileValidationError) {
    return res.send(req.fileValidationError);
  }
  next();
};

const createOrUpdateParking = async (req, res) => {
  try {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    const { direction, lp_part1, lp_part2 } = req.body;
    const plate = `${lp_part1}-${lp_part2}`;
    const parking = await Parking.findOne({ plate, status: "parking" });

    if (parking) {
      if (direction === "in") {
        throw new Error("Parking already exist!");
      }
    }

    if (!parking) {
      if (direction === "out") {
        throw new Error("Parking not found!");
      }
    }

    if (req.files) {
      const uploadPromises = req.files.map((file) => {
        return new Promise((resolve, reject) => {
          const { originalname, buffer, fieldname } = file;
          if (fieldname === "log") {
            cloudinary.uploader
              .upload_stream(
                {
                  folder: "parking",
                  public_id: `${new Date().getTime()}_${
                    originalname.split(".")[0]
                  }`,
                  resource_type: "image",
                },
                (error, result) => {
                  if (error) {
                    console.error(error);
                    reject(error);
                  } else {
                    req.body.image = result.url;
                    resolve(result);
                  }
                }
              )
              .end(buffer);
          }
        });
      });

      await Promise.all(uploadPromises);
    }

    if (direction === "in") {
      await Parking.create({
        plate,
        imageIn: req.body.image,
        checkIn: new Date(),
        updateAt: new Date(),
      });
    } else {
      const checkOut = new Date();
      let hours = differenceInHours(
        new Date(checkOut),
        new Date(parking.checkIn)
      );
      if (hours <= 0) {
        hours = 1;
      }

      parking.imageOut = req.body.image;
      parking.checkOut = checkOut;
      parking.totalPayment = hours * 10;
      parking.status = "completed";
      parking.updateAt = new Date();

      await parking.save();
    }

    res.status(201).json({
      status: "success",
      message: "Parking check in!",
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

app.post("/api/parking", upload.any(), getImageParking, createOrUpdateParking);

app.listen(port, () => {
  console.log("Server Listening on port:", port);
});
