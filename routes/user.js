const express = require("express");
const router = express.Router();
const usersController = require("../controllers/usersController");

router.post("/signup", usersController.validateSignup, usersController.signup);
router.post("/login", usersController.login);
router.get("/logout", usersController.logout);
router.get("/check-auth", usersController.checkAuth);

module.exports = router;
