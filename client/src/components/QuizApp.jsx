import { useState, useEffect } from 'react';
import '../styles/QuizApp.css';

const QuizApp = () => {
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [difficulty, setDifficulty] = useState(5); // Scale of 1-10
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Add answer validation logic
    // Adjust difficulty based on performance
    setFeedback('Great job! Moving to next question...');
    setUserAnswer('');
  };

  return (
    <div className="quiz-container">
      <header className="quiz-header">
        <h1>Adaptive Learning Platform</h1>
        <div className="quiz-stats">
          <span>Difficulty: {difficulty}/10</span>
          <span>Score: {score}</span>
        </div>
      </header>

      <main className="quiz-content">
        {currentQuestion ? (
          <div className="question-card">
            <h2 className="question-text">{currentQuestion.text}</h2>
            <form onSubmit={handleSubmit} className="answer-form">
              <input
                type="text"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="Enter your answer..."
                className="answer-input"
              />
              <button type="submit" className="submit-btn">
                Submit Answer
              </button>
            </form>
            {feedback && <div className="feedback">{feedback}</div>}
          </div>
        ) : (
          <div className="loading">Loading question...</div>
        )}
      </main>
    </div>
  );
};

export default QuizApp; 