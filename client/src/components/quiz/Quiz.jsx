import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/Quiz.css';

const Quiz = () => {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [difficulty, setDifficulty] = useState(5);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      // For testing, we'll use sample questions until the API is ready
      const sampleQuestions = [
        {
          id: 1,
          text: "What is 2 + 2?",
          category: "math",
          difficulty: 1
        },
        {
          id: 2,
          text: "What is the capital of France?",
          category: "geography",
          difficulty: 3
        },
        {
          id: 3,
          text: "What is the square root of 144?",
          category: "math",
          difficulty: 5
        },
        {
          id: 4,
          text: "Who wrote 'Romeo and Juliet'?",
          category: "literature",
          difficulty: 4
        },
        {
          id: 5,
          text: "What is the chemical symbol for gold?",
          category: "science",
          difficulty: 6
        }
      ];
      
      setQuestions(sampleQuestions);
      setLoading(false);
    } catch (err) {
      setError('Failed to load questions');
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (currentAnswer.trim() === '') return;

    try {
      // For testing, we'll simulate API response
      const correctAnswers = {
        1: "4",
        2: "paris",
        3: "12",
        4: "william shakespeare",
        5: "au"
      };

      const isCorrect = currentAnswer.toLowerCase().trim() === 
        correctAnswers[questions[currentIndex].id].toLowerCase();
      
      const answerData = {
        question: questions[currentIndex],
        userAnswer: currentAnswer,
        correct: isCorrect,
        timeTaken: 0
      };

      setUserAnswers([...userAnswers, answerData]);
      setCurrentAnswer('');

      if (currentIndex < questions.length - 1) {
        setCurrentIndex(currentIndex + 1);
        setDifficulty(prev => isCorrect ? Math.min(prev + 1, 10) : Math.max(prev - 1, 1));
      } else {
        navigate('/analysis', { 
          state: { 
            answers: [...userAnswers, answerData],
            finalDifficulty: difficulty
          }
        });
      }
    } catch (err) {
      setError('Failed to submit answer');
    }
  };

  if (loading) return <div className="quiz-loading">Loading quiz...</div>;
  if (error) return <div className="quiz-error">{error}</div>;
  if (questions.length === 0) return <div className="quiz-error">No questions available</div>;

  const currentQuestion = questions[currentIndex];

  return (
    <div className="quiz-container">
      <div className="quiz-progress">
        <div className="progress-bar">
          <div 
            className="progress-fill"
            style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
          />
        </div>
        <span>Question {currentIndex + 1} of {questions.length}</span>
      </div>

      <div className="quiz-stats">
        <span>Difficulty: {difficulty}/10</span>
        <span>Score: {userAnswers.filter(a => a.correct).length}</span>
      </div>

      <div className="question-card">
        <h2 className="question-text">{currentQuestion.text}</h2>
        <form onSubmit={handleSubmit} className="answer-form">
          <input
            type="text"
            value={currentAnswer}
            onChange={(e) => setCurrentAnswer(e.target.value)}
            placeholder="Enter your answer..."
            className="answer-input"
            autoFocus
          />
          <button type="submit" className="submit-btn">
            {currentIndex === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Quiz; 