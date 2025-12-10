const express = require("express");
const app = express();
const captainRoute = require("./routes/captainRoutes.js");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const connect = require("./db/db.js");

dotenv.config();
connect();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/", captainRoute);


module.exports = app
