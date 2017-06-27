"use strict";
// USER MODEL
const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

// USER SCHEMA
// ==================================================
const UserSchema = new Schema({
  name: String,
  username: {
    type: String,
    requried: true,
    index: {
      unique: true
    }
  },
  password: {
    type: String,
    required: true,
    select: false
  },
  admin: Boolean,
}, {
  timestamps: true
});

// Create a user model from Schema
const User = mongoose.model('User', UserSchema);
//Export the user model
module.exports = User;
