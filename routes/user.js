const express = require("express");
const User = require("../models/user.models");
const bcrypt = require("bcrypt");
const router = express.Router();

router.get("/", (req, res) => {
  res.json(User);
});

router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;
  const isUserExist = await User.findOne({ email });
  if (isUserExist) {
    res.status(400).json({message:"User already exist"});
  }
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(password, salt);
  try {
    const newUser = await User.create({
      username,
      email,
      password: hashPassword,
    });
    res.status(200).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({message: "Error in creating user", error: error.message});
  }
});

module.exports = router;