const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  title: { type: String, required: true },
  profilePhoto: { type: String },
  linkedIn: { type: String },
  twitter: { type: String }
});

const User = mongoose.model("User", userSchema);

module.exports = User;
