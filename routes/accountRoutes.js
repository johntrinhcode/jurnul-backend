const router = require("express").Router();
const User = require("../model/User.js");
const { auth } = require("../middleware/verifyToken.js");

router.get("/", auth, (req, res) => {
  // After using auth as middleware, you have access to req.user!
  res.send(req.user);
});

// Get all user information.
router.post("/info", auth, async (req, res) => {
  const userId = req.body.userId;
  const userInfo = User.findOne({ _id: userId });

  if (!userInfo) return res.status(400).send("User info not found.");

  return res.status(200).send((await userInfo).toJSON());
});

router.post("/entry", auth, async (req, res) => {
  const user = req.body.userId;
  const date = req.body.entryDate;
  const long = req.body.entryLong;
  const lat = req.body.entryLat;
  const city = req.body.entryCity;
  const state = req.body.entryState;
  const weatherCondition = req.body.entryWeatherCondition;
  const weatherTemp = req.body.entryWeatherTemp;
  const weatherIcon = req.body.entryWeatherIcon;
  const rating = req.body.entryRating;
  const description = req.body.entryDescription;

  const targetUser = await User.findOne({ _id: user });

  const entry = {
    date: date,
    location: {
      city: city,
      state: state,
      long: long,
      lat: lat
    },
    weather: {
      condition: weatherCondition,
      temperature: weatherTemp,
      icon: weatherIcon
    },
    rating: rating,
    description: description
  };

  try {
    await targetUser.entries.push(entry);
    await targetUser.save();
    res.status(200).send("Journal entry saved.");
  } catch (error) {
    res.status(400).send(error);
  }
});

module.exports = router;
