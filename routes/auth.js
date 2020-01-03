const express = require("express");
const User = require("../model/User.js");
const bcrypt = require("bcryptjs");

const {
  registerValidate,
  loginValidate
} = require("../validation/validation.js");
const jwt = require("jsonwebtoken");
const router = express.Router();

// Register a user.
router.post("/register", async (req, res) => {
  // Validate data.
  const { error } = registerValidate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // Ensure email isn't already registered.
  const duplicate = await User.findOne({ email: req.body.email });
  if (duplicate) return res.status(400).send("User already registered.");

  // Encrypt password.
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword
  });

  try {
    const savedUser = await user.save();
    res.send(savedUser._id);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Login a user.
router.post("/login", async (req, res) => {
  // Validate data.
  const { error } = loginValidate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // Checking if email exists.
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Email not registered.");

  // Password is correct.
  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send("Incorrect password.");

  // Create & assign token.
  const token = jwt.sign({ _id: user._id }, process.env.JWT_KEY);
  res.header("auth-token", token).send({ token: token, user: user._id });
});

module.exports = router;
