// Input validation utilities
const validateQuiz = (data) => {
  const errors = [];

  if (!data.title || data.title.trim() === '') {
    errors.push('Title is required');
  }

  if (!Array.isArray(data.questions) || data.questions.length === 0) {
    errors.push('At least one question is required');
  }

  data.questions.forEach((q, idx) => {
    if (!q.text) errors.push(`Question ${idx + 1}: text is required`);
    if (!q.options || !q.options.A || !q.options.B || !q.options.C || !q.options.D) {
      errors.push(`Question ${idx + 1}: all options (A, B, C, D) are required`);
    }
    if (!['A', 'B', 'C', 'D'].includes(q.correctAnswer)) {
      errors.push(`Question ${idx + 1}: correct answer must be A, B, C, or D`);
    }
  });

  if (data.timeLimit && data.timeLimit < 10) {
    errors.push('Time limit must be at least 10 seconds');
  }

  return errors;
};

const validateResponse = (data) => {
  const errors = [];

  if (!data.quizId) errors.push('quizId is required');
  if (!data.studentId) errors.push('studentId is required');
  if (!Array.isArray(data.responses)) errors.push('responses must be an array');

  return errors;
};

module.exports = {
  validateQuiz,
  validateResponse
};
