const mongoose = require('mongoose');

const topicSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: String,
  userId: String,
  nickname: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ForumTopic', topicSchema);