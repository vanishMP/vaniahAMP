const mongoose = require('mongoose');

const privateMessageSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  fromUserId: String,
  toUserId: String,
  content: String,
  createdAt: { type: Date, default: Date.now },
  read: { type: Boolean, default: false }
});

module.exports = mongoose.model('PrivateMessage', privateMessageSchema);