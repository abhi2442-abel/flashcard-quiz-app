import React, { useState, useEffect } from 'react';
import './QuizDisplay.css';

const QuizDisplay = ({ quiz, onResponseDetected }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(quiz.timeLimit);
  const [detectedOption, setDetectedOption] = useState(null);
  const [cameraActive, setCameraActive] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleQuizEnd();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleQuizEnd = () => {
    setCameraActive(false);
    // Call API to finalize quiz
  };

  const handleDetection = (option) => {
    setDetectedOption(option);
    onResponseDetected({
      questionId: quiz.questions[currentQuestion].questionId,
      selectedOption: option,
      confidence: 0.95
    });
  };

  const question = quiz.questions[currentQuestion];

  return (
    <div className="quiz-container">
      <div className="quiz-header">
        <h2>{quiz.title}</h2>
        <div className="timer">Time: {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}</div>
      </div>

      <div className="question-display">
        <h3>Question {currentQuestion + 1} of {quiz.questions.length}</h3>
        <p>{question.text}</p>
        {question.imageUrl && <img src={question.imageUrl} alt="Question" />}
      </div>

      <div className="options-display">
        {['A', 'B', 'C', 'D'].map(option => (
          <div
            key={option}
            className={`option ${detectedOption === option ? 'detected' : ''}`}
          >
            <div className="option-letter">{option}</div>
            <div className="option-text">{question.options[option]}</div>
          </div>
        ))}
      </div>

      <div className="camera-feed" style={{ display: cameraActive ? 'block' : 'none' }}>
        <p>Camera is detecting flashcard options...</p>
        {/* Camera component will go here */}
      </div>
    </div>
  );
};

export default QuizDisplay;
