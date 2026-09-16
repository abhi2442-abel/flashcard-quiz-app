const express = require('express');
const router = express.Router();
const Response = require('../models/Response');
const Quiz = require('../models/Quiz');

// GET /api/analytics/quiz/:quizId - Get complete quiz analytics
router.get('/quiz/:quizId', async (req, res, next) => {
  try {
    const responses = await Response.find({ quizId: req.params.quizId });
    const quiz = await Quiz.findById(req.params.quizId);

    if (!quiz) {
      return res.status(404).json({ error: 'Quiz not found' });
    }

    // Initialize stats object
    const stats = {
      quizTitle: quiz.title,
      totalStudents: responses.length,
      totalQuestions: quiz.questions.length,
      questionAnalytics: {},
      overallStats: {
        averageScore: 0,
        highestScore: 0,
        lowestScore: 0
      }
    };

    // Initialize question stats
    quiz.questions.forEach(question => {
      stats.questionAnalytics[question.questionId] = {
        questionText: question.text,
        correctAnswer: question.correctAnswer,
        A: { count: 0, students: [], correctCount: 0 },
        B: { count: 0, students: [], correctCount: 0 },
        C: { count: 0, students: [], correctCount: 0 },
        D: { count: 0, students: [], correctCount: 0 }
      };
    });

    let totalScore = 0;
    let scores = [];

    // Process each student's responses
    responses.forEach(response => {
      scores.push(response.score);
      totalScore += response.score;

      response.responses.forEach(answer => {
        if (stats.questionAnalytics[answer.questionId]) {
          const option = answer.selectedOption;
          stats.questionAnalytics[answer.questionId][option].count++;
          stats.questionAnalytics[answer.questionId][option].students.push({
            studentId: response.studentId,
            studentName: response.studentName,
            confidence: answer.detectionConfidence
          });

          if (answer.isCorrect) {
            stats.questionAnalytics[answer.questionId][option].correctCount++;
          }
        }
      });
    });

    // Calculate overall stats
    if (responses.length > 0) {
      stats.overallStats.averageScore = totalScore / responses.length;
      stats.overallStats.highestScore = Math.max(...scores);
      stats.overallStats.lowestScore = Math.min(...scores);
    }

    res.json({
      data: stats
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/analytics/quiz/:quizId/question/:questionId/option/:option
// Get all students who selected a specific option for a question
router.get('/quiz/:quizId/question/:questionId/option/:option', async (req, res, next) => {
  try {
    const { quizId, questionId, option } = req.params;

    if (!['A', 'B', 'C', 'D'].includes(option)) {
      return res.status(400).json({ error: 'Invalid option. Must be A, B, C, or D' });
    }

    const responses = await Response.find({ quizId });

    const students = [];
    responses.forEach(response => {
      response.responses.forEach(answer => {
        if (answer.questionId === questionId && answer.selectedOption === option) {
          students.push({
            studentId: response.studentId,
            studentName: response.studentName,
            selectedOption: answer.selectedOption,
            isCorrect: answer.isCorrect,
            confidence: answer.detectionConfidence,
            timestamp: answer.timestamp
          });
        }
      });
    });

    res.json({
      data: {
        option,
        questionId,
        totalCount: students.length,
        students,
        correctCount: students.filter(s => s.isCorrect).length
      }
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/analytics/student/:studentId - Get all student's quiz results
router.get('/student/:studentId', async (req, res, next) => {
  try {
    const responses = await Response.find({ studentId: req.params.studentId }).populate('quizId', 'title');

    if (!responses.length) {
      return res.status(404).json({ error: 'No responses found for this student' });
    }

    const stats = responses.map(resp => ({
      quizId: resp.quizId._id,
      quizTitle: resp.quizId.title,
      score: resp.score,
      totalQuestions: resp.responses.length,
      percentage: ((resp.score / resp.responses.length) * 100).toFixed(2),
      submittedAt: resp.submittedAt
    }));

    res.json({
      data: stats,
      totalQuizzesTaken: stats.length,
      averageScore: (stats.reduce((sum, s) => sum + parseFloat(s.percentage), 0) / stats.length).toFixed(2)
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
