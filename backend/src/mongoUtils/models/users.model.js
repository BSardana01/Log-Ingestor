const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String },
  mobile: { type: String, unique: true },
  roleId: { type: mongoose.Types.ObjectId, ref: 'role' },
  password: { type: String },
});

userSchema.index({ mobile: 1 });

module.exports = mongoose.model('user', userSchema, 'user');