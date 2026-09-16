const express = require('express');
const router = express.Router();
const Quiz = require('../models/Quiz');

// Create a new quiz
router.post('/', async (req, res) => {
  try {
    const { title, description, questions, timeLimit, createdBy } = req.body;

    // Validate input
    if (!title || !questions || questions.length === 0) {
      return res.status(400).json({ error: 'Title and questions are required' });
    }

    const newQuiz = new Quiz({
      title,
      description,
      questions,
      timeLimit: timeLimit || 3600,
      createdBy,
      status: 'draft'
    });

    const savedQuiz = await newQuiz.save();
    res.status(201).json(savedQuiz);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all quizzes
router.get('/', async (req, res) => {
  try {
    const quizzes = await Quiz.find().select('-questions'); // Don't return full questions list
    res.json(quizzes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single quiz
router.get('/:id', async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ error: 'Quiz not found' });
    res.json(quiz);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update quiz
router.put('/:id', async (req, res) => {
  try {
    const { title, description, questions, timeLimit } = req.body;
    const quiz = await Quiz.findByIdAndUpdate(
      req.params.id,
      { title, description, questions, timeLimit },
      { new: true }
    );
    if (!quiz) return res.status(404).json({ error: 'Quiz not found' });
    res.json(quiz);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Change quiz status (draft → active → completed)
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    if (!['draft', 'active', 'completed'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const updateData = { status };
    if (status === 'active') {
      updateData.startTime = new Date();
    } else if (status === 'completed') {
      updateData.endTime = new Date();
    }

    const quiz = await Quiz.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!quiz) return res.status(404).json({ error: 'Quiz not found' });
    res.json(quiz);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete quiz
router.delete('/:id', async (req, res) => {
  try {
    const quiz = await Quiz.findByIdAndDelete(req.params.id);
    if (!quiz) return res.status(404).json({ error: 'Quiz not found' });
    res.json({ message: 'Quiz deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
