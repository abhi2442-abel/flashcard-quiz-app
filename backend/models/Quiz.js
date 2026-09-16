const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Quiz title is required'],
    trim: true,
    minlength: [3, 'Title must be at least 3 characters']
  },
  description: {
    type: String,
    trim: true
  },
  questions: [{
    questionId: {
      type: String,
      required: true
    },
    text: {
      type: String,
      required: [true, 'Question text is required']
    },
    imageUrl: String,
    options: {
      A: { type: String, required: true },
      B: { type: String, required: true },
      C: { type: String, required: true },
      D: { type: String, required: true }
    },
    correctAnswer: {
      type: String,
      enum: ['A', 'B', 'C', 'D'],
      required: [true, 'Correct answer must be specified']
    }
  }],
  timeLimit: {
    type: Number,
    default: 3600,
    min: [10, 'Time limit must be at least 10 seconds']
  },
  startTime: Date,
  endTime: Date,
  status: {
    type: String,
    enum: ['draft', 'active', 'completed'],
    default: 'draft'
  },
  createdBy: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Index for faster queries
quizSchema.index({ status: 1, createdAt: -1 });
quizSchema.index({ createdBy: 1 });

module.exports = mongoose.model('Quiz', quizSchema);
