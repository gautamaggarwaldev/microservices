const express = require('express');
const { userAuth } = require('../middleware/authMiddleware.js');
const { createRide } = require('../controller/rideController.js');
const router = express.Router();

router.post("/create-ride", userAuth, createRide);

module.exports = router;