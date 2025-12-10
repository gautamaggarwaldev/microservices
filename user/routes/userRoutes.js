const express = require("express");
const userController = require("../controller/userController.js");
const authMiddleware = require("../middleware/authMiddleware.js");
const router = express.Router();

router.post("/register", userController.register);
router.post("/login", userController.login);
router.post("/logout", userController.logout);
router.get("/profile", authMiddleware.userAuth, userController.getProfile);
module.exports = router;