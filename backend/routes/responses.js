const express = require('express');
const router = express.Router();
const Response = require('../models/Response');
const Quiz = require('../models/Quiz');
const { validateResponse, validateSingleResponse } = require('../utils/validation');

// ============= SUBMIT RESPONSES =============
// POST /api/responses - Submit all responses at once
router.post('/', async (req, res, next) => {
  try {
    const { quizId, studentId, studentName, responses } = req.body;

    // Validate input
    const validationErrors = validateResponse(req.body);
    if (validationErrors.length > 0) {
      return res.status(400).json({
        error: 'Validation failed',
        details: validationErrors
      });
    }

    // Fetch quiz to get correct answers
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ error: 'Quiz not found' });
    }

    // Mark correct/incorrect answers
    const processedResponses = responses.map(response => {
      const question = quiz.questions.find(q => q.questionId === response.questionId);
      return {
        ...response,
        correctOption: question ? question.correctAnswer : null,
        isCorrect: question && response.selectedOption === question.correctAnswer
      };
    });

    const newResponse = new Response({
      quizId,
      studentId,
      studentName: studentName || `Student ${studentId}`,
      responses: processedResponses
    });

    const savedResponse = await newResponse.save();
    
    res.status(201).json({
      message: 'Responses submitted successfully',
      data: {
        ...savedResponse.toObject(),
        score: savedResponse.score,
        totalQuestions: processedResponses.length
      }
    });
  } catch (error) {
    next(error);
  }
});

// ============= REAL-TIME SUBMISSION =============
// POST /api/responses/submit-single - Submit single response during quiz
router.post('/submit-single', async (req, res, next) => {
  try {
    const { quizId, studentId, questionId, selectedOption, detectionConfidence } = req.body;

    // Validate input
    const validationErrors = validateSingleResponse(req.body);
    if (validationErrors.length > 0) {
      return res.status(400).json({
        error: 'Validation failed',
        details: validationErrors
      });
    }

    // Fetch quiz to get correct answer for this question
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ error: 'Quiz not found' });
    }

    const question = quiz.questions.find(q => q.questionId === questionId);
    if (!question) {
      return res.status(404).json({ error: 'Question not found' });
    }

    const isCorrect = selectedOption === question.correctAnswer;

    const response = await Response.findOneAndUpdate(
      { quizId, studentId },
      {
        $push: {
          responses: {
            questionId,
            selectedOption,
            correctOption: question.correctAnswer,
            isCorrect,
            detectionConfidence: detectionConfidence || 1.0,
            timestamp: new Date()
          }
        }
      },
      { upsert: true, new: true, runValidators: true }
    );

    res.json({
      message: 'Response recorded',
      data: {
        questionId,
        selectedOption,
        isCorrect,
        confidence: detectionConfidence || 1.0,
        score: response.score
      }
    });
  } catch (error) {
    next(error);
  }
});

// ============= GET RESPONSES =============
// GET /api/responses/quiz/:quizId - Get all responses for a quiz
router.get('/quiz/:quizId', async (req, res, next) => {
  try {
    const responses = await Response.find({ quizId: req.params.quizId }).select('-__v');
    
    res.json({
      data: responses,
      total: responses.length
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/responses/:quizId/:studentId - Get specific student's responses
router.get('/:quizId/:studentId', async (req, res, next) => {
  try {
    const response = await Response.findOne({
      quizId: req.params.quizId,
      studentId: req.params.studentId
    });

    if (!response) {
      return res.status(404).json({ error: 'Response not found' });
    }

    res.json({ data: response });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
