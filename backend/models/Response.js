const mongoose = require('mongoose');

const responseSchema = new mongoose.Schema({
  quizId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quiz',
    required: true
  },
  studentId: {
    type: String,
    required: true
  },
  studentName: String,
  responses: [{
    questionId: String,
    selectedOption: {
      type: String,
      enum: ['A', 'B', 'C', 'D']
    },
    correctOption: String,
    isCorrect: Boolean,
    timestamp: {
      type: Date,
      default: Date.now
    },
    detectionConfidence: {
      type: Number,
      min: 0,
      max: 1
    }
  }],
  submittedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Response', responseSchema);
