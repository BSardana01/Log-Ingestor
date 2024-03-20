const mongoose = require('mongoose');

const { ROLES } = require('../constants');

const roleSchema = new mongoose.Schema({
  name: { type: String, enum: Object.values(ROLES) },
}, { timestamps: true });

module.exports = mongoose.model('role', roleSchema, 'role');