const express = require("express");
const multer = require("multer");
const mqtt = require("mqtt");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const Slot = require("./models/slot");
const Area = require("./models/area");

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

// Set up storage for uploaded files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "/storage/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

const app = express();
port = 8800;
app.listen(port, () => {
  console.log("Server Listening on port:", port);
});

app.post("/data", upload.single("log"), (req, res) => {
  const data = JSON.parse(JSON.stringify(req.body));
  console.log(`direction: ${data.direction}`);
  console.log(`license-plate: ${data.lp_part1}-${data.lp_part2}`);
  console.log(`saved file at: ${req.file.path}`);
  res.status(200).json("okla");
});
