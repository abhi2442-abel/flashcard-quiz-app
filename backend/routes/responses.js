const express = require('express');
const router = express.Router();
const Response = require('../models/Response');
const Quiz = require('../models/Quiz');

// Submit a student response
router.post('/', async (req, res) => {
  try {
    const { quizId, studentId, studentName, responses } = req.body;

    if (!quizId || !studentId || !responses) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const newResponse = new Response({
      quizId,
      studentId,
      studentName: studentName || `Student ${studentId}`,
      responses
    });

    const savedResponse = await newResponse.save();
    res.status(201).json(savedResponse);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all responses for a quiz
router.get('/quiz/:quizId', async (req, res) => {
  try {
    const responses = await Response.find({ quizId: req.params.quizId });
    res.json(responses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get specific student's responses
router.get('/:quizId/:studentId', async (req, res) => {
  try {
    const response = await Response.findOne({
      quizId: req.params.quizId,
      studentId: req.params.studentId
    });
    if (!response) return res.status(404).json({ error: 'Response not found' });
    res.json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Submit single response (real-time during quiz)
router.post('/submit-single', async (req, res) => {
  try {
    const { quizId, studentId, questionId, selectedOption, detectionConfidence } = req.body;

    const response = await Response.findOneAndUpdate(
      { quizId, studentId },
      {
        $push: {
          responses: {
            questionId,
            selectedOption,
            detectionConfidence,
            timestamp: new Date()
          }
        }
      },
      { upsert: true, new: true }
    );

    res.json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
