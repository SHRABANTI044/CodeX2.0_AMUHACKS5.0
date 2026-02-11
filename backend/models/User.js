const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  completion: { type: Number, required: true, min: 0, max: 100 },
  difficulty: { type: String, required: true, enum: ['Easy', 'Medium', 'Hard'] },
  deadline: { type: Date },
});

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  semester: { type: String },
  subjects: [subjectSchema],
  hoursPerDay: { type: Number, required: true },
  studyDays: { type: Number, required: true },
  learningPace: { type: String, required: true, enum: ['Slow', 'Medium', 'Fast'] },
});

module.exports = mongoose.model('User', userSchema);
