// Input validation utilities
const validateQuiz = (data) => {
  const errors = [];

  if (!data.title || data.title.trim() === '') {
    errors.push('Title is required');
  } else if (data.title.length < 3) {
    errors.push('Title must be at least 3 characters');
  }

  if (!Array.isArray(data.questions) || data.questions.length === 0) {
    errors.push('At least one question is required');
  }

  if (data.questions && Array.isArray(data.questions)) {
    data.questions.forEach((q, idx) => {
      if (!q.text || q.text.trim() === '') {
        errors.push(`Question ${idx + 1}: text is required`);
      }
      if (!q.options || !q.options.A || !q.options.B || !q.options.C || !q.options.D) {
        errors.push(`Question ${idx + 1}: all options (A, B, C, D) are required`);
      }
      if (!['A', 'B', 'C', 'D'].includes(q.correctAnswer)) {
        errors.push(`Question ${idx + 1}: correct answer must be A, B, C, or D`);
      }
    });
  }

  if (data.timeLimit && data.timeLimit < 10) {
    errors.push('Time limit must be at least 10 seconds');
  }

  if (!data.createdBy || data.createdBy.trim() === '') {
    errors.push('Creator ID is required');
  }

  return errors;
};

const validateResponse = (data) => {
  const errors = [];

  if (!data.quizId) errors.push('quizId is required');
  if (!data.studentId) errors.push('studentId is required');
  if (!Array.isArray(data.responses)) errors.push('responses must be an array');

  data.responses?.forEach((r, idx) => {
    if (!['A', 'B', 'C', 'D'].includes(r.selectedOption)) {
      errors.push(`Response ${idx + 1}: selectedOption must be A, B, C, or D`);
    }
  });

  return errors;
};

const validateSingleResponse = (data) => {
  const errors = [];

  if (!data.quizId) errors.push('quizId is required');
  if (!data.studentId) errors.push('studentId is required');
  if (!data.questionId) errors.push('questionId is required');
  if (!['A', 'B', 'C', 'D'].includes(data.selectedOption)) {
    errors.push('selectedOption must be A, B, C, or D');
  }

  if (data.detectionConfidence !== undefined) {
    if (data.detectionConfidence < 0 || data.detectionConfidence > 1) {
      errors.push('detectionConfidence must be between 0 and 1');
    }
  }

  return errors;
};

module.exports = {
  validateQuiz,
  validateResponse,
  validateSingleResponse
};
