const jwt = require("jsonwebtoken");
const User = require("../model/User.js");

const refresh = async (req, res, next) => {
  const oldToken = req.header("Authorization").replace("Bearer ", "");
  const data = jwt.verify(oldToken, process.env.JWT_KEY);

  try {
    const user = await User.findOne({
      _id: data._id,
      "tokens.token": oldToken
    });

    if (!user) {
      throw new Error();
    }

    // Generate a new token.
    const newToken = await user.generateAuthToken();

    // Get rid of the old one.
    user.tokens = user.tokens.filter(token => {
      return token.token != oldToken;
    });

    await user.save();

    req.user = user;
    req.token = newToken;

    next();
  } catch (error) {
    res.status(401).send({ error: "Authorization failed." });
  }
};

module.exports = refresh;
