const mongoose = require('mongoose');

const logsSchema = new mongoose.Schema({
  level: { type: String },
  message: { type: String, minlength: 1 },
  resourceId: { type: String },
  timestamp: { type: Date },
  traceId: { type: String },
  spanId: { type: String },
  commit: { type: String },
  metadata: {
    parentResourceId: { type: String },
  },
  accessLevel: {
    roleId: { type: mongoose.Types.ObjectId, ref: 'role' },
  },
}, { timestamps: true });

logsSchema.index({ message: 'text' });
logsSchema.index({ resourceId: 1 });
logsSchema.index({ traceId: 1 });
logsSchema.index({ spanId: 1 });
logsSchema.index({ commit: 1 });
logsSchema.index({ 'metadata.parentResourceId': 1 });
logsSchema.index({ timestamp: -1 });

module.exports = mongoose.model('log', logsSchema, 'log');