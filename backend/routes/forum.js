const express = require('express');
const ForumTopic = require('../models/ForumTopic');
const ForumMessage = require('../models/ForumMessage');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();

// Темы
router.get('/topics', async (req, res) => {
  try {
    const topics = await ForumTopic.find().sort({ createdAt: -1 });
    res.json(topics);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/topics', async (req, res) => {
  try {
    const { title, userId, nickname } = req.body;
    const topic = new ForumTopic({
      id: uuidv4(),
      title,
      userId,
      nickname,
      createdAt: new Date()
    });
    await topic.save();
    res.status(201).json(topic);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Сообщения в теме
router.get('/topics/:topicId/messages', async (req, res) => {
  try {
    const messages = await ForumMessage.find({ topicId: req.params.topicId }).sort({ createdAt: 1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/topics/:topicId/messages', async (req, res) => {
  try {
    const { content, userId, nickname } = req.body;
    const message = new ForumMessage({
      id: uuidv4(),
      topicId: req.params.topicId,
      content,
      userId,
      nickname,
      createdAt: new Date()
    });
    await message.save();
    res.status(201).json(message);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;