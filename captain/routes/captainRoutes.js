const express = require("express");
const captainController = require("../controller/captainController.js");
const authMiddleware = require("../middleware/authMiddleware.js");
const router = express.Router();

router.post("/register", captainController.register);
router.post("/login", captainController.login);
router.post("/logout", captainController.logout);
router.get("/profile", authMiddleware.captainAuth, captainController.getProfile);
router.put("/change-availability", authMiddleware.captainAuth, captainController.toggleAvailability); 
router.get("/new-ride", authMiddleware.captainAuth, captainController.waitFornewRide);
module.exports = router;