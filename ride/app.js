const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const app = express();
const rideRoute = require("./routes/rideRoutes.js");
const cookieParser = require("cookie-parser");
const connect = require("./db/db.js");
const rabbitMQ = require("./service/rabbit.js");

connect();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

rabbitMQ.connect();
app.use("/", rideRoute);


module.exports = app
