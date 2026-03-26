const express = require('express');
const PrivateMessage = require('../models/PrivateMessage');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();

// Получить все диалоги для пользователя (список участников)
router.get('/conversations/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const messages = await PrivateMessage.find({
      $or: [{ fromUserId: userId }, { toUserId: userId }]
    }).sort({ createdAt: -1 });

    // Группируем по собеседнику
    const participants = new Map();
    messages.forEach(msg => {
      const otherId = msg.fromUserId === userId ? msg.toUserId : msg.fromUserId;
      if (!participants.has(otherId)) {
        participants.set(otherId, { lastMsg: msg });
      } else {
        const existing = participants.get(otherId);
        if (msg.createdAt > existing.lastMsg.createdAt) existing.lastMsg = msg;
      }
    });
    // Получаем ники участников (можно отдельным запросом, но пока вернём только lastMsg)
    res.json(Array.from(participants.values()).map(p => p.lastMsg));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Получить сообщения между двумя пользователями
router.get('/:userId/:otherUserId', async (req, res) => {
  try {
    const { userId, otherUserId } = req.params;
    const messages = await PrivateMessage.find({
      $or: [
        { fromUserId: userId, toUserId: otherUserId },
        { fromUserId: otherUserId, toUserId: userId }
      ]
    }).sort({ createdAt: 1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Отправить сообщение
router.post('/', async (req, res) => {
  try {
    const { fromUserId, toUserId, content } = req.body;
    const message = new PrivateMessage({
      id: uuidv4(),
      fromUserId,
      toUserId,
      content,
      createdAt: new Date(),
      read: false
    });
    await message.save();
    res.status(201).json(message);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;