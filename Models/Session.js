const mongoose = require('mongoose');

const SessionSchema = new mongoose.Schema({
  _id: String,
  data: Object
}, { collection: process.env.SESSION_TABLE || 'session' });

module.exports = mongoose.model('Session', SessionSchema);
