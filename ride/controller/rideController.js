const rideModel = require('../models/rideModel');
const { publishToQueue } = require('../service/rabbit');

module.exports.createRide = async (req, res) => {
  const { pickup, destination } = req.body;

  const newRide = new rideModel({
    user: req.user._id,
    pickup,
    destination
  });

  await newRide.save();
  publishToQueue("new-ride", JSON.stringify(newRide));
  res.send(newRide);
}