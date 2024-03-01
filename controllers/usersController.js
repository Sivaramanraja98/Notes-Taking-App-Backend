const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const User = require("../models/userSchema");
const { check } = require("express-validator");

const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal Server Error" });
};

const validateSignup = [
  check("email").isEmail().withMessage("Please enter a valid email address"),
  check("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),
];

const signup = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    const hashpassword = bcrypt.hashSync(password, 10);
    await User.create({
      email,
      password: hashpassword,
    });
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Invalid User" });
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid Password" });
    }
    const expiresIn = process.env.JWT_EXPIRES_IN || "7d";
    const token = jwt.sign({ sub: user._id }, process.env.SECRET, {
      expiresIn,
    });
    res.cookie("Authorization", token, {
      maxAge: expiresIn * 1000,
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });
    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    next(error);
  }
};

const logout = (req, res, next) => {
  try {
    res.clearCookie("Authorization");
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    next(error);
  }
};

const checkAuth = (req, res, next) => {
  try {
    res.status(200).json({ message: "Authentication successful" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  signup,
  login,
  logout,
  checkAuth,
  errorHandler,
  validateSignup,
};
