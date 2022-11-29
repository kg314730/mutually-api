const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  career_details: {
    type: Array,
  },
  total_experience: {
    type: Number,
  },
  educational_details: {
    type: Array,
  },
  skills: {
    type: Array,
  },
  projects: {
    type: Array,
  },
  profile_picture: {
    type: String,
  },
  resume: {
    type: String,
  },
  profile_set: {
    type: Boolean,
  },
  current_company: {
    type: String,
    index: true,
  },
  current_experience: {
    type: Number,
  },
  current_position: {
    type: String,
  },
  messages: {
    type: Array,
  },
  referral_history: {
    type: Array,
  },
});
module.exports = mongoose.model("User", userSchema);
