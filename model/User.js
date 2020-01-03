const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    validate: value => {
      if (!validator.isEmail(value)) {
        throw new Error({ error: "Invalid email address." });
      }
    }
  },
  password: {
    type: String,
    required: true,
    minLength: 7
  },
  tokens: [
    {
      token: {
        type: String,
        required: true
      }
    }
  ],
  entries: [
    {
      date: {
        type: Number,
        required: true
      },
      location: {
        city: {
          type: String,
          required: true
        },
        state: {
          type: String,
          required: true
        },
        long: {
          type: Number,
          required: true
        },
        lat: {
          type: Number,
          required: true
        }
      },
      weather: {
        condition: {
          type: String,
          required: true
        },
        temperature: {
          type: Number,
          required: true
        },
        icon: {
          type: String,
          required: true
        }
      },
      rating: {
        type: Number,
        required: true
      },
      description: {
        type: String,
        required: true
      }
    }
  ]
});
/*

// Avoid arrow function because 'this' is not defined otherwise.
userSchema.pre("save", async function(next) {
  const user = this;

  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }

  next();
});

// Avoid arrow function because 'this' is not defined otherwise.
userSchema.methods.generateAuthToken = async function() {
  // Generate an auth token for this user.
  const user = this;
  const token = jwt.sign({ _id: user._id }, process.env.JWT_KEY, {
    expiresIn: "1h"
  });

  user.tokens = user.tokens.concat({ token });

  await user.save();
  return token;
};

userSchema.statics.findByCredentials = async (email, password) => {
  // Search for a user by email and password.
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error({ error: "Invalid log in credentials." });
  }

  const isPasswordMatch = await bcrypt.compare(password, user.password);

  if (!isPasswordMatch) {
    throw new Error({ error: "Invalid log in credentials." });
  }

  return user;
};
*/
const User = mongoose.model("User", userSchema);

module.exports = User;
