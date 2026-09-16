const express = require('express');
const router = express.Router();
const Quiz = require('../models/Quiz');
const { validateQuiz } = require('../utils/validation');

// ============= CREATE =============
// POST /api/quizzes - Create a new quiz
router.post('/', async (req, res, next) => {
  try {
    const { title, description, questions, timeLimit, createdBy } = req.body;

    // Validate input
    const validationErrors = validateQuiz(req.body);
    if (validationErrors.length > 0) {
      return res.status(400).json({
        error: 'Validation failed',
        details: validationErrors
      });
    }

    // Create quiz with unique question IDs
    const questionsWithIds = questions.map((q, idx) => ({
      ...q,
      questionId: `q-${Date.now()}-${idx}`
    }));

    const newQuiz = new Quiz({
      title,
      description,
      questions: questionsWithIds,
      timeLimit: timeLimit || 3600,
      createdBy,
      status: 'draft'
    });

    const savedQuiz = await newQuiz.save();
    
    res.status(201).json({
      message: 'Quiz created successfully',
      data: savedQuiz
    });
  } catch (error) {
    next(error);
  }
});

// ============= READ =============
// GET /api/quizzes - Get all quizzes
router.get('/', async (req, res, next) => {
  try {
    const { status, createdBy, page = 1, limit = 10 } = req.query;
    
    let query = {};
    if (status) query.status = status;
    if (createdBy) query.createdBy = createdBy;

    const skip = (page - 1) * limit;

    const quizzes = await Quiz.find(query)
      .select('-questions')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Quiz.countDocuments(query);

    res.json({
      data: quizzes,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/quizzes/:id - Get single quiz with all questions
router.get('/:id', async (req, res, next) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    
    if (!quiz) {
      return res.status(404).json({ error: 'Quiz not found' });
    }

    res.json({ data: quiz });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ error: 'Invalid quiz ID' });
    }
    next(error);
  }
});

// ============= UPDATE =============
// PUT /api/quizzes/:id - Update entire quiz
router.put('/:id', async (req, res, next) => {
  try {
    const { title, description, questions, timeLimit } = req.body;

    // Validate input
    const validationErrors = validateQuiz(req.body);
    if (validationErrors.length > 0) {
      return res.status(400).json({
        error: 'Validation failed',
        details: validationErrors
      });
    }

    const questionsWithIds = questions.map((q, idx) => ({
      ...q,
      questionId: q.questionId || `q-${Date.now()}-${idx}`
    }));

    const quiz = await Quiz.findByIdAndUpdate(
      req.params.id,
      {
        title,
        description,
        questions: questionsWithIds,
        timeLimit,
        updatedAt: new Date()
      },
      { new: true, runValidators: true }
    );

    if (!quiz) {
      return res.status(404).json({ error: 'Quiz not found' });
    }

    res.json({
      message: 'Quiz updated successfully',
      data: quiz
    });
  } catch (error) {
    next(error);
  }
});

// PATCH /api/quizzes/:id/status - Change quiz status (draft → active → completed)
router.patch('/:id/status', async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!['draft', 'active', 'completed'].includes(status)) {
      return res.status(400).json({
        error: 'Invalid status. Must be: draft, active, or completed'
      });
    }

    const updateData = {
      status,
      updatedAt: new Date()
    };

    if (status === 'active') {
      updateData.startTime = new Date();
    } else if (status === 'completed') {
      updateData.endTime = new Date();
    }

    const quiz = await Quiz.findByIdAndUpdate(req.params.id, updateData, { new: true });

    if (!quiz) {
      return res.status(404).json({ error: 'Quiz not found' });
    }

    res.json({
      message: `Quiz status changed to ${status}`,
      data: quiz
    });
  } catch (error) {
    next(error);
  }
});

// ============= DELETE =============
// DELETE /api/quizzes/:id - Delete quiz
router.delete('/:id', async (req, res, next) => {
  try {
    const quiz = await Quiz.findByIdAndDelete(req.params.id);

    if (!quiz) {
      return res.status(404).json({ error: 'Quiz not found' });
    }

    res.json({
      message: 'Quiz deleted successfully',
      data: quiz
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
