const express = require('express');
const { userAuth, captainAuth } = require('../middleware/authMiddleware.js');
const { createRide, acceptRide } = require('../controller/rideController.js');
const router = express.Router();

router.post("/create-ride", userAuth, createRide);
router.put("/accept-ride", captainAuth, acceptRide);

module.exports = router;