const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  userType: {
    type: String,
    enum: ['volunteer', 'ngo'],
    default: 'volunteer',
  },
});


module.exports = mongoose.model('User', userSchema);
