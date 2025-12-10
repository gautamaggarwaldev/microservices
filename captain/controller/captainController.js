const captainModel = require("../models/captainModel.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const blacklistTokenModel = require("../models/blacklistTokenModel.js");
const { subscribeToQueue } = require("../../ride/service/rabbit.js");

const pendingRides = [];

module.exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const captain = await captainModel.findOne({ email });

    if (captain) {
      return res.status(400).json({ message: "captain already exists" });
    }

    const hash = await bcrypt.hash(password, 10);
    const newCaptain = new captainModel({ name, email, password: hash });
    await newCaptain.save();

    const token = jwt.sign({ id: newCaptain._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    res.cookie("token", token);

    delete newCaptain._doc.password;

    res
      .status(201)
      .json({ message: "captain registered successfully", token, newCaptain });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const captain = await captainModel.findOne({ email }).select("+password");

    if (!captain) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, captain.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ id: captain._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    delete captain._doc.password;

    res.cookie("token", token);

    res.send({ token, captain });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports.logout = async (req, res) => {
  try {
    const token = req.cookies.token;
    await blacklistTokenModel.create({ token });
    res.clearCookie("token");
    res.send({ message: "Captain logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports.getProfile = async (req, res) => {
  try {
    const captain = req.captain;
    res.send({ captain });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports.toggleAvailability = async (req, res) => {
  try {
    const captain = await captainModel.findById(req.captain._id);
    captain.isAvailable = !captain.isAvailable;
    await captain.save();
    res.send({
      message: "Availability status updated",
      isAvailable: captain.isAvailable,
      captain,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports.waitFornewRide = async (req, res) => {
  req.setTimeout(30000, () => {
    // Set timeout for long polling
    res.status(204).end();
  });

  pendingRides.push(res); // Store the response object to notify later
};

subscribeToQueue("new-ride", (data) => {
  const rideData = JSON.parse(data);

  pendingRides.forEach((res) => {
    // Notify all pending responses
    res.json(rideData);
  });

  pendingRides.length = 0; // Clear the array after notifying all pending responses
});
