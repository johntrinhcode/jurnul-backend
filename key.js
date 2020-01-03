const mongoose = require("mongoose");
const bcrypt = require("bcrypt-nodejs");

// Define the user schema.
const userSchema = new mongoose.Schema(
  {
    username: String,
    email: {
      type: String,
      unique: true
    },
    password: String,
    image: String
  },
  {
    timestamps: true
  }
);

// Before saving our model, encrypt the password.
userSchema.pre(
  "save",
  next => {
    const user = this;
    if (!user.isModified("password")) {
      return next();
    }

    bcrypt.hash(user.password, 10).then(hashedPassword => {
      user.password = hashedPassword;
      next();
    });
  },
  err => {
    next(err);
  }
);

// A method associated with a user document, lets us compare the password to the input.
userSchema.methods.comparePasswords = (candidatePassword, next) => {
  bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
    return err ? next(err) : next(null, isMatch);
  });
};

module.exports = mongoose.model("user", userSchema);
