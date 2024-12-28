const express = require("express");
const User = require("../models/user.models");
const bcrypt = require("bcrypt");
const router = express.Router();
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
dotenv.config();
const secretKey = process.env.JWT_Secret;

// router.get("/", async (req, res) => {
//   const users = await User.find();
//   res.json(users);
// });

router.post("/register", async (req, res) => {
  const { username, email, password, confirmPassword } = req.body;
  const isUserExist = await User.findOne({ email });
  if (isUserExist) {
    return res.status(400).json({ message: "User already exist" });
  }
  if (password !== confirmPassword) {
    return res
      .status(400)
      .json({ message: "Enter same password in both fields" });
  }
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(password, salt);
  try {
    const newUser = await User.create({
      username,
      email,
      password: hashPassword,
    });
    return res.status(200).json({ message: "User registered successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res
      .status(400)
      .json({ message: "Either Email is wrong or Password is wrong" });
  }
  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    return res
      .status(400)
      .json({ message: "Either Email is wrong or Password is wrong" });
  }
  try {
    const payload = {
      id: user._id,
    };
    const token = await jwt.sign(payload, secretKey);
    return res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "User cannot login", error: error.message });
  }
});

module.exports = router;