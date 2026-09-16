const mongoose = require('mongoose');

const responseSchema = new mongoose.Schema({
  quizId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quiz',
    required: [true, 'Quiz ID is required'],
    index: true
  },
  studentId: {
    type: String,
    required: [true, 'Student ID is required'],
    index: true
  },
  studentName: {
    type: String,
    default: 'Anonymous Student'
  },
  responses: [
    {
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
        max: 1,
        default: 1.0
      }
    }
  ],
  score: {
    type: Number,
    default: 0
  },
  submittedAt: {
    type: Date,
    default: Date.now,
    index: true
  }
});

// Compound index for faster lookups
responseSchema.index({ quizId: 1, studentId: 1 });

// Calculate score before saving
responseSchema.pre('save', function(next) {
  const correctCount = this.responses.filter(r => r.isCorrect).length;
  this.score = correctCount;
  next();
});

module.exports = mongoose.model('Response', responseSchema);
