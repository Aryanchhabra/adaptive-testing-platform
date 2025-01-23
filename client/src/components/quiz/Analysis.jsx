import { useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import '../../styles/Analysis.css';

const Analysis = () => {
  const location = useLocation();
  const { answers, finalDifficulty } = location.state || { answers: [], finalDifficulty: 5 };

  const correctAnswers = answers.filter(a => a.correct).length;
  const accuracy = (correctAnswers / answers.length) * 100;
  
  const getPerformanceMessage = () => {
    if (accuracy >= 80) return "Excellent performance!";
    if (accuracy >= 60) return "Good job!";
    if (accuracy >= 40) return "Keep practicing!";
    return "More practice needed";
  };

  const getRecommendations = () => {
    const weakCategories = answers
      .filter(a => !a.correct)
      .map(a => a.question.category);
    
    const uniqueCategories = [...new Set(weakCategories)];
    return uniqueCategories.map(category => (
      `Focus on improving your ${category} skills`
    ));
  };

  return (
    <div className="analysis-container">
      <motion.div 
        className="analysis-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1>Quiz Analysis</h1>
        
        <div className="score-summary">
          <div className="score-circle">
            <span className="score-percentage">{Math.round(accuracy)}%</span>
            <span className="score-label">Accuracy</span>
          </div>
          <h2>{getPerformanceMessage()}</h2>
        </div>

        <div className="stats-grid">
          <div className="stat-item">
            <span className="stat-label">Questions Attempted</span>
            <span className="stat-value">{answers.length}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Correct Answers</span>
            <span className="stat-value">{correctAnswers}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Final Difficulty</span>
            <span className="stat-value">{finalDifficulty}/10</span>
          </div>
        </div>

        <div className="recommendations">
          <h3>Recommendations</h3>
          <ul>
            {getRecommendations().map((rec, index) => (
              <li key={index}>{rec}</li>
            ))}
          </ul>
        </div>

        <div className="action-buttons">
          <Link to="/quiz" className="button primary">Try Another Quiz</Link>
          <Link to="/" className="button secondary">Back to Home</Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Analysis; 