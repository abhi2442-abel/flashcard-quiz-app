const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: String,
  questions: [{
    questionId: String,
    text: String,
    imageUrl: String,
    options: {
      A: String,
      B: String,
      C: String,
      D: String
    },
    correctAnswer: {
      type: String,
      enum: ['A', 'B', 'C', 'D']
    }
  }],
  timeLimit: {
    type: Number, // seconds
    default: 3600
  },
  startTime: Date,
  endTime: Date,
  status: {
    type: String,
    enum: ['draft', 'active', 'completed'],
    default: 'draft'
  },
  createdBy: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Quiz', quizSchema);
