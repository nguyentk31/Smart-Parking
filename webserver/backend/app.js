const morgan = require("morgan");
const helmet = require("helmet");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const path = require("path");

const app = express();

const userRoute = require("./routes/user");
const areaRoute = require("./routes/area");
const slotRoute = require("./routes/slot");
// const notificationRoute = require("./routes/notification");
const parkingRoute = require("./routes/parking");

app.use(morgan("dev"));

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(helmet());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(function (req, _res, next) {
  const url = req.url;
  const method = req.method;
  console.log(`URL: ${url}`);
  console.log(`Method: ${method}`);
  next();
});
app.use(function (req, _res, next) {
  req.headers["if-none-match"] = "no-match-for-this";
  next();
});
app.use("/api/user", userRoute);
app.use("/api/area", areaRoute);
app.use("/api/slot", slotRoute);
// app.use("/api/notification", notificationRoute);
app.use("/api/parking", parkingRoute);

// app.use(express.static(path.join(__dirname, "../client/src/assets")));

module.exports = app;
