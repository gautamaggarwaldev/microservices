const express = require("express");
const app = express();
const userRoute = require("./routes/userRoutes.js");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const connect = require("./db/db.js");

dotenv.config();
connect();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/", userRoute);


module.exports = app
