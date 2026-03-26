const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  topicId: String,
  content: String,
  userId: String,
  nickname: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ForumMessage', messageSchema);