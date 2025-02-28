import React, { useState, useEffect } from 'react';
import { 
  Box, Container, Typography, Paper, Button, 
  CircularProgress, LinearProgress, Chip, Tooltip 
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { Code, Timer, Psychology, TrendingUp } from '@mui/icons-material';
import { useAuthContext } from '../../contexts/AuthContext';
import { linkedinColors } from '../../theme';

const TopicChip = ({ topic }) => (
  <Chip
    label={topic}
    color="primary"
    size="small"
    sx={{
      background: `linear-gradient(45deg, ${linkedinColors.primary}, ${linkedinColors.light})`,
      fontWeight: 500,
      mb: 2
    }}
  />
);

const DifficultyIndicator = ({ level }) => (
  <Box sx={{ display: 'flex', gap: 0.5, mb: 2 }}>
    {[1, 2, 3, 4, 5].map((n) => (
      <Box
        key={n}
        sx={{
          width: 20,
          height: 4,
          borderRadius: 1,
          bgcolor: n <= level ? linkedinColors.primary : 'rgba(255,255,255,0.1)'
        }}
      />
    ))}
  </Box>
);

const Timer = ({ startTime }) => {
  const [time, setTime] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [startTime]);

  return (
    <Typography variant="body2" color="text.secondary">
      Time: {Math.floor(time / 60)}:{(time % 60).toString().padStart(2, '0')}
    </Typography>
  );
};

function AdaptiveTest() {
  const [loading, setLoading] = useState(true);
  const [question, setQuestion] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [progress, setProgress] = useState({});
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [startTime] = useState(Date.now());
  const [performanceHistory, setPerformanceHistory] = useState([]);
  const { user } = useAuthContext();

  useEffect(() => {
    if (user) {
      startTest();
    }
  }, [user]);

  const startTest = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/quiz/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await response.json();
      setQuestion(data.question);
      setProgress(data.knowledgeState);
      setFeedback(null);
      setLoading(false);
    } catch (error) {
      console.error('Error starting test:', error);
      setLoading(false);
    }
  };

  const handleAnswer = async (selectedAnswer) => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/quiz/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question,
          answer: selectedAnswer,
          knowledgeState: progress,
          currentQuestion,
          performanceHistory: [...performanceHistory, {
            topic: question.topic,
            correct: selectedAnswer === question.correctAnswer,
            difficulty: question.difficulty,
            timeSpent: Math.floor((Date.now() - startTime) / 1000)
          }]
        }),
      });
      
      const data = await response.json();
      
      if (data.complete) {
        // Navigate to results page with analysis
        navigate('/results', { state: { analysis: data.analysis } });
        return;
      }

      setFeedback({
        isCorrect: data.correct,
        explanation: data.explanation
      });
      
      setProgress(data.knowledgeState);
      setCurrentQuestion(data.currentQuestion);
      
      setTimeout(() => {
        setQuestion(data.nextQuestion);
        setFeedback(null);
        setLoading(false);
      }, 3000);
    } catch (error) {
      console.error('Error submitting answer:', error);
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4 }}>
        {/* Progress Header */}
        <Paper sx={{ p: 3, mb: 3, bgcolor: 'background.paper' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">Python Assessment</Typography>
            <Timer startTime={startTime} />
          </Box>
          
          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <Chip 
              icon={<Psychology />} 
              label={`Question ${currentQuestion}/20`} 
            />
            <Chip 
              icon={<TrendingUp />} 
              label={`Avg. Score: ${Math.round(
                Object.values(progress).reduce((a, b) => a + b, 0) / 
                Object.values(progress).length * 100
              )}%`} 
            />
          </Box>

          <LinearProgress 
            variant="determinate" 
            value={currentQuestion * 5} 
            sx={{ 
              height: 8, 
              borderRadius: 4,
              bgcolor: 'rgba(255,255,255,0.1)',
              '& .MuiLinearProgress-bar': {
                background: `linear-gradient(45deg, 
                  ${linkedinColors.primary}, 
                  ${linkedinColors.light})`
              }
            }} 
          />
        </Paper>

        <AnimatePresence mode="wait">
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <CircularProgress />
            </Box>
          ) : question ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Paper sx={{ p: 4, bgcolor: 'background.paper' }}>
                <TopicChip topic={question.topic} />
                <DifficultyIndicator level={question.difficulty} />
                
                <Typography variant="h5" gutterBottom>
                  {question.text}
                </Typography>

                <Box sx={{ mt: 4, display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {question.options.map((option, index) => (
                    <Button
                      key={index}
                      variant="outlined"
                      onClick={() => handleAnswer(index)}
                      disabled={loading || feedback}
                      sx={{
                        justifyContent: 'flex-start',
                        textAlign: 'left',
                        p: 2,
                        borderColor: 'rgba(255,255,255,0.1)',
                        '&:hover': {
                          borderColor: linkedinColors.primary,
                          bgcolor: `${linkedinColors.primary}10`,
                        }
                      }}
                    >
                      {option}
                    </Button>
                  ))}
                </Box>
              </Paper>

              {feedback && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Paper
                    sx={{
                      p: 4,
                      mt: 3,
                      bgcolor: feedback.isCorrect ? 'success.dark' : 'error.dark',
                    }}
                  >
                    <Typography variant="h6" gutterBottom>
                      {feedback.isCorrect ? '✨ Correct!' : '❌ Incorrect'}
                    </Typography>
                    <Typography sx={{ opacity: 0.9 }}>
                      {feedback.explanation}
                    </Typography>
                  </Paper>
                </motion.div>
              )}
            </motion.div>
          ) : null}
        </AnimatePresence>
      </Box>
    </Container>
  );
}

export default AdaptiveTest; 