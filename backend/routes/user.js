const express = require('express');
const router = express.Router();

// In-memory storage for demonstration (replace with MongoDB when available)
let users = [];
let nextId = 1;

// POST /api/user
router.post('/user', (req, res) => {
  try {
    const user = { ...req.body, _id: nextId.toString() };
    users.push(user);
    nextId++;
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// GET /api/user/:id
router.get('/user/:id', (req, res) => {
  try {
    const user = users.find(u => u._id === req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/user/:id
router.put('/user/:id', (req, res) => {
  try {
    const index = users.findIndex(u => u._id === req.params.id);
    if (index === -1) return res.status(404).json({ error: 'User not found' });
    users[index] = { ...users[index], ...req.body };
    res.json(users[index]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
