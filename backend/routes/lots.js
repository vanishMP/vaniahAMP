const express = require('express');
const Lot = require('../models/Lot');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();

// Получить все лоты
router.get('/', async (req, res) => {
  try {
    const lots = await Lot.find().sort({ createdAt: -1 });
    res.json(lots);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Создать лот
router.post('/', async (req, res) => {
  try {
    const { title, desc, price, category, imageUrl, userId, nickname } = req.body;
    const newLot = new Lot({
      id: uuidv4(),
      title,
      desc,
      price,
      category,
      imageUrl,
      userId,
      nickname,
      createdAt: new Date()
    });
    await newLot.save();
    res.status(201).json(newLot);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Удалить лот (только автор)
router.delete('/:id', async (req, res) => {
  try {
    const { userId } = req.headers;
    const lot = await Lot.findOne({ id: req.params.id });
    if (!lot) return res.status(404).json({ error: 'Лот не найден' });
    if (lot.userId !== userId) return res.status(403).json({ error: 'Не ваш лот' });
    await lot.deleteOne();
    res.json({ message: 'Лот удалён' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;