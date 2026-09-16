const express = require('express');
const router = express.Router();
const Response = require('../models/Response');

// Get analytics for a quiz
router.get('/quiz/:quizId', async (req, res) => {
  try {
    const { quizId } = req.params;
    const responses = await Response.find({ quizId });

    // Calculate statistics
    const stats = {
      totalStudents: responses.length,
      questionAnalytics: {}
    };

    responses.forEach(response => {
      response.responses.forEach(answer => {
        if (!stats.questionAnalytics[answer.questionId]) {
          stats.questionAnalytics[answer.questionId] = {
            A: { count: 0, students: [] },
            B: { count: 0, students: [] },
            C: { count: 0, students: [] },
            D: { count: 0, students: [] }
          };
        }
        const option = answer.selectedOption;
        stats.questionAnalytics[answer.questionId][option].count++;
        stats.questionAnalytics[answer.questionId][option].students.push({
          studentId: response.studentId,
          studentName: response.studentName
        });
      });
    });

    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get students who selected a specific option for a question
router.get('/quiz/:quizId/question/:questionId/option/:option', async (req, res) => {
  try {
    const { quizId, questionId, option } = req.params;
    const responses = await Response.find({ quizId });

    const students = [];
    responses.forEach(response => {
      response.responses.forEach(answer => {
        if (answer.questionId === questionId && answer.selectedOption === option) {
          students.push({
            studentId: response.studentId,
            studentName: response.studentName,
            confidence: answer.detectionConfidence
          });
        }
      });
    });

    res.json({ option, students, count: students.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
