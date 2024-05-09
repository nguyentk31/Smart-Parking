const dotenv = require("dotenv");
const app = require("./app");
const mongoose = require("mongoose");
const http = require("http");
const { Server } = require("socket.io");
const io = require("socket.io-client");
const Slot = require("./models/slot");
const Parking = require("./models/parking");

dotenv.config({
  path: ".env",
});

const port = process.env.PORT || 5001;
// const DB = process.env.DATABASE_LOCAL;
const DB = process.env.DATABASE_CLOUD.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

const server = http.createServer(app);
const socket = io("http://localhost:3000");

Slot.watch().on("change", async (change) => {
  const slot = await Slot.findById(change.documentKey._id);
  const slots = await Slot.find({ area: slot.area._id });
  socket.emit("sendSlot", slots);
});

Parking.watch().on("change", async (change) => {
  const parkings = await Parking.find();
  socket.emit("sendParking", parkings);
});

mongoose.connect(DB).then(() => {
  console.log("DB connection successful");
});

const socketIo = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});

socketIo.on("connection", (socket) => {
  console.log("New client connected" + socket.id);

  socket.on("sendSlot", (data) => {
    socketIo.emit("receiveSlot", data);
  });

  socket.on("sendParking", (data) => {
    socketIo.emit("receiveParking", data);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

server.listen(port, () => {
  console.log(`app is running on port ${port}`);
});
