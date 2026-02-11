const express = require('express');
const router = express.Router();

// In-memory storage reference (same as user.js)
const userRoutes = require('./user');
let users = userRoutes.users;

// GET /api/schedule/:userId
router.get('/schedule/:userId', (req, res) => {
  try {
    const user = users.find(u => u._id === req.params.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Simple schedule generation
    const schedule = {
      dailyPlan: user.subjects.map(subject => ({
        subjectName: subject.subjectName,
        hours: 2, // Default hours
        difficulty: subject.difficulty
      })),
      totalDays: 7
    };
    res.json(schedule);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/update-progress/:userId
router.put('/update-progress/:userId', (req, res) => {
  try {
    const { subjectId, completionPercentage } = req.body;
    const userIndex = users.findIndex(u => u._id === req.params.userId);
    if (userIndex === -1) return res.status(404).json({ error: 'User not found' });

    // Update subject completion
    const subjectIndex = users[userIndex].subjects.findIndex(s => s.subjectId === subjectId);
    if (subjectIndex === -1) return res.status(404).json({ error: 'Subject not found' });

    users[userIndex].subjects[subjectIndex].completionPercentage = completionPercentage;

    // Generate updated schedule
    const schedule = {
      dailyPlan: users[userIndex].subjects.map(subject => ({
        subjectName: subject.subjectName,
        hours: 2,
        difficulty: subject.difficulty
      })),
      totalDays: 7
    };
    res.json({ user: users[userIndex], schedule });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
