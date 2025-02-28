import React, { useState, useEffect } from 'react';
import { 
  Box, Container, Typography, Button, Paper, 
  RadioGroup, FormControlLabel, Radio,
  CircularProgress, LinearProgress, Alert,
  Card, CardContent, Fade, Grow
} from '@mui/material';
import { motion } from 'framer-motion';
import { styled } from '@mui/material/styles';
import QuizIntro from './QuizIntro';
import QuizSummary from './QuizSummary';
import QuizComplete from './QuizComplete';

// Styled components
const ProgressBar = styled(LinearProgress)(({ theme }) => ({
  height: 10,
  borderRadius: 5,
  [`&.${LinearProgress}-colorPrimary`]: {
    backgroundColor: theme.palette.grey[200],
  },
  [`& .${LinearProgress}-bar`]: {
    borderRadius: 5,
    background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
  },
}));

const QuestionCard = styled(Card)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.spacing(2),
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-4px)',
  },
}));

const OptionButton = styled(FormControlLabel)(({ theme }) => ({
  margin: theme.spacing(1, 0),
  padding: theme.spacing(1),
  borderRadius: theme.spacing(1),
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
  '&.Mui-disabled': {
    opacity: 0.7,
  },
}));

const ProgressIndicator = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
  marginBottom: theme.spacing(4)
}));

const AdaptiveQuiz = () => {
  const [session, setSession] = useState(null);
  const [question, setQuestion] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState(null);
  const [knowledgeState, setKnowledgeState] = useState({});
  const [error, setError] = useState(null);
  const [questionNumber, setQuestionNumber] = useState(1);
  const TOTAL_QUESTIONS = 10;
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [finalStats, setFinalStats] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [nextQuestion, setNextQuestion] = useState(null);
  const [nextKnowledgeState, setNextKnowledgeState] = useState({});
  const [startTime, setStartTime] = useState(null);
  const [analysis, setAnalysis] = useState(null);

  // Start quiz session
  useEffect(() => {
    startQuiz();
  }, []);

  useEffect(() => {
    const loadTimeout = setTimeout(() => {
        if (loading) {
            setLoading(false);
            setError('Loading timeout - please try again');
        }
    }, 10000); // 10 second timeout

    return () => clearTimeout(loadTimeout);
  }, [loading]);

  const startQuiz = async () => {
    try {
        setLoading(true);
        setError(null);
        
        const response = await fetch('/api/start-quiz', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });
        
        let data;
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            data = await response.json();
        } else {
            throw new Error('Server returned non-JSON response');
        }
        
        console.log("Server response:", data); // Debug log
        
        if (data.status === 'error') {
            throw new Error(data.message);
        }
        
        if (!data.question) {
            throw new Error('No question received from server');
        }
        
        setQuestion(data.question);
        if (data.session_id !== undefined) {
            setSession(data.session_id);
        }
        
        // Start timing when question is displayed
        setStartTime(Date.now());
        
    } catch (err) {
        console.error('Error starting quiz:', err);
        setError(err.message || 'Failed to start quiz');
    } finally {
        setLoading(false);
    }
  };

  const handleNextQuestion = () => {
    if (!nextQuestion) {
        setError("No next question available");
        return;
    }

    // Update all states in one go
    setQuestion(nextQuestion);
    setNextQuestion(null);
    setFeedback(null);
    setSelectedAnswer(null);
    setQuestionNumber(prev => prev + 1);
    
    // Reset timer for new question
    setStartTime(Date.now());
  };

  const submitAnswer = async (selectedAnswer) => {
    try {
        setIsSubmitting(true);
        setError(null);

        // Calculate response time
        const endTime = Date.now();
        const responseTime = startTime ? (endTime - startTime) / 1000 : 0; // Convert to seconds

        const response = await fetch('/api/quiz/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                session_id: session,
                answer_data: {
                    selected_answer: selectedAnswer,
                    response_time: responseTime
                }
            })
        });

        const data = await response.json();
        console.log("Submit response:", data); // Debug log

        if (data.status === 'error') {
            throw new Error(data.message);
        }

        // Update state with feedback
        setFeedback(data.feedback);
        setNextQuestion(data.next_question);
        setKnowledgeState(data.knowledge_state);

        if (data.completed) {
            setQuizCompleted(true);
            setFinalStats(data.progress);
            setAnalysis(data.analysis);
        }

    } catch (err) {
        console.error('Error submitting answer:', err);
        setError(err.message || 'Failed to submit answer');
    } finally {
        setIsSubmitting(false);
    }
  };

  const renderKnowledgeState = () => (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" gutterBottom sx={{ 
        background: 'linear-gradient(45deg, #0A66C2, #0b7ad4)',
        backgroundClip: 'text',
        WebkitBackgroundClip: 'text',
        color: 'transparent',
        fontWeight: 'bold'
      }}>
        Knowledge Progress
      </Typography>
      <Box sx={{ 
        display: 'grid', 
        gap: 3,
        gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }
      }}>
        {Object.entries(knowledgeState).map(([topic, data]) => (
          <Grow key={topic} in={true}>
            <Card sx={{ p: 2, height: '100%' }}>
              <Typography variant="body1" fontWeight="medium" gutterBottom>
                {topic}
              </Typography>
              <ProgressBar 
                variant="determinate" 
                value={data.level * 100} 
              />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                <Typography variant="caption" color="text.secondary">
                  Status: {data.status}
                </Typography>
                <Typography variant="caption">
                  {Math.round(data.level * 100)}% Mastery
                </Typography>
              </Box>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                {data.explanation}
              </Typography>
            </Card>
          </Grow>
        ))}
      </Box>
    </Box>
  );

  const handleStartQuiz = () => {
    setQuizStarted(true);
    startQuiz();
  };

  const handleRetakeQuiz = () => {
    setQuizCompleted(false);
    setQuestionNumber(1);
    setKnowledgeState({});
    startQuiz();
  };

  if (!quizStarted) {
    return <QuizIntro onStartQuiz={handleStartQuiz} />;
  }

  if (loading) {
    return (
      <Container sx={{ 
        mt: 4, 
        minHeight: '60vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          gap: 2 
        }}>
          <CircularProgress />
          <Typography>Loading your personalized questions...</Typography>
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ 
        mt: 4, 
        minHeight: '60vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          gap: 2 
        }}>
          <Alert severity="error">{error}</Alert>
          <Button 
            variant="contained" 
            onClick={() => {
              setError(null);
              startQuiz();
            }}
          >
            Try Again
          </Button>
        </Box>
      </Container>
    );
  }

  if (quizCompleted) {
    return <QuizComplete 
        stats={finalStats} 
        knowledgeState={knowledgeState}
        analysis={analysis}
        onRetakeQuiz={handleRetakeQuiz}
    />;
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <QuestionCard elevation={3}>
          <CardContent sx={{ p: 4 }}>
            <ProgressIndicator>
              <Typography variant="h6" color="primary" fontWeight="bold">
                Question {questionNumber}/{TOTAL_QUESTIONS}
              </Typography>
              <LinearProgress 
                variant="determinate" 
                value={(questionNumber / TOTAL_QUESTIONS) * 100}
                sx={{ 
                  flexGrow: 1, 
                  height: 8, 
                  borderRadius: 4,
                  backgroundColor: 'rgba(0,0,0,0.1)',
                  '& .MuiLinearProgress-bar': {
                    background: 'linear-gradient(45deg, #0A66C2, #0b7ad4)',
                  }
                }} 
              />
            </ProgressIndicator>

            {question ? (
                <>
                    <Typography variant="h5" gutterBottom>
                        {question.text}
                    </Typography>
                    
                    <Box sx={{ my: 3 }}>
                        <RadioGroup
                            value={selectedAnswer}
                            onChange={(e) => setSelectedAnswer(Number(e.target.value))}
                        >
                            {question.options.map((option, index) => (
                                <Fade in={true} key={index} style={{ transitionDelay: `${index * 50}ms` }}>
                                    <OptionButton
                                        value={index}
                                        control={<Radio />}
                                        label={option}
                                        disabled={feedback !== null}
                                    />
                                </Fade>
                            ))}
                        </RadioGroup>
                    </Box>

                    {feedback && (
                        <Fade in={true}>
                            <Box sx={{ 
                                mt: 2, 
                                p: 2, 
                                bgcolor: feedback.is_correct ? 'success.light' : 'error.light',
                                borderRadius: 1
                            }}>
                                <Typography variant="h6">
                                    {feedback.is_correct ? 'Correct!' : 'Incorrect'}
                                </Typography>
                                <Typography>
                                    {feedback.explanation}
                                </Typography>
                                {!feedback.is_correct && (
                                    <Typography>
                                        Correct answer: {question.options[feedback.correct_answer]}
                                    </Typography>
                                )}
                            </Box>
                        </Fade>
                    )}

                    <Button
                        variant="contained"
                        onClick={feedback ? handleNextQuestion : () => submitAnswer(selectedAnswer)}
                        disabled={!feedback && selectedAnswer === null}
                        sx={{ 
                            mt: 3,
                            minWidth: 120,
                            backgroundColor: feedback ? 'success.main' : 'primary.main'
                        }}
                    >
                        {isSubmitting ? (
                            <CircularProgress size={24} color="inherit" />
                        ) : feedback ? (
                            'Next Question'
                        ) : (
                            'Submit Answer'
                        )}
                    </Button>
                </>
            ) : (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                    <CircularProgress />
                </Box>
            )}

            {renderKnowledgeState()}
          </CardContent>
        </QuestionCard>
      </motion.div>
    </Container>
  );
};

export default AdaptiveQuiz; 