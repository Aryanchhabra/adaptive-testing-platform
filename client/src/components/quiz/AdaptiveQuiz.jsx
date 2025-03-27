import React, { useState, useEffect } from 'react';
import { 
  Box, Container, Typography, Button, Paper, 
  RadioGroup, FormControlLabel, Radio,
  CircularProgress, LinearProgress, Alert,
  Card, CardContent, Fade, Grow, Grid
} from '@mui/material';
import { motion } from 'framer-motion';
import { styled } from '@mui/material/styles';
import QuizIntro from './QuizIntro';
import QuizSummary from './QuizSummary';
import QuizComplete from './QuizComplete';
import { CheckCircleOutline, CancelOutlined, NavigateNext } from '@mui/icons-material';

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
    // Don't automatically start the quiz, just initialize loading to false
    setLoading(false);
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
        
        // Reset quiz state
        setQuestion(null);
        setSelectedAnswer(null);
        setFeedback(null);
        setQuizCompleted(false);
        setFinalStats(null);
        setAnalysis(null);
        setNextQuestion(null);
        setQuestionNumber(1);
        
        const response = await fetch('/api/start-quiz', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('Server error response:', errorText);
            throw new Error(`Server error: ${response.status} ${response.statusText}`);
        }
        
        let data;
        try {
            data = await response.json();
            console.log("Server response:", data); // Debug log
        } catch (jsonError) {
            console.error("Failed to parse JSON:", jsonError);
            throw new Error('Server returned invalid JSON response');
        }
        
        if (!data || data.error) {
            throw new Error(data?.error || 'Invalid response from server');
        }
        
        if (data.question) {
            setQuestion(data.question);
            setSession(data.session_id);
            setKnowledgeState(data.knowledgeState || data.knowledge_state || {});
            // Start timing when question is displayed
            setStartTime(Date.now());
            // Only set quizStarted to true if the server indicates it should start
            // or if the server doesn't provide this flag (backward compatibility)
            setQuizStarted(data.quizStarted !== false);
        } else {
            throw new Error('No question received from server');
        }
        
    } catch (err) {
        console.error('Error starting quiz:', err);
        setError(err.message || 'Failed to start quiz. Please try again.');
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

        console.log("Submitting answer:", selectedAnswer);
        console.log("Session ID:", session);

        // Validate required data
        if (!question || !question.id) {
            throw new Error("Question data is missing");
        }

        // Calculate response time
        const endTime = Date.now();
        const responseTime = startTime ? (endTime - startTime) / 1000 : 0; // Convert to seconds

        const requestBody = {
            question: question,
            answer: selectedAnswer,
            knowledgeState: knowledgeState,
            // Include these fields for compatibility with the updated server
            session_id: session,
            question_id: question?.id,
            selected_option: selectedAnswer,
            answer_data: {
                selected_answer: selectedAnswer,
                response_time: responseTime
            }
        };
        
        console.log("Request body:", requestBody);

        const response = await fetch('/api/quiz/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Server error response:', errorText);
            throw new Error(`Server error: ${response.status} ${response.statusText}`);
        }

        let data;
        try {
            data = await response.json();
            console.log("Submit response:", data); // Debug log
        } catch (jsonError) {
            console.error("Failed to parse JSON:", jsonError);
            throw new Error('Server returned invalid JSON response');
        }

        if (!data || data.status === 'error') {
            throw new Error(data?.message || 'Error processing answer');
        }

        // Update state with feedback
        console.log("Setting feedback:", data.feedback);
        setFeedback(data.feedback);
        
        console.log("Setting next question:", data.next_question);
        setNextQuestion(data.next_question);
        
        console.log("Setting knowledge state:", data.knowledge_state);
        setKnowledgeState(data.knowledge_state || {});

        if (data.completed) {
            console.log("Quiz completed, setting final stats:", data.progress);
            setQuizCompleted(true);
            setFinalStats(data.progress || {});
            setAnalysis(data.analysis || {});
        }

    } catch (err) {
        console.error('Error submitting answer:', err);
        setError(err.message || 'Failed to submit answer. Please try again.');
    } finally {
        setIsSubmitting(false);
    }
  };

  const renderKnowledgeState = () => {
    // Skip rendering if knowledgeState is empty or not properly formatted
    if (!knowledgeState || Object.keys(knowledgeState).length === 0) {
      return null;
    }

    // Filter out non-topic keys that shouldn't be displayed as progress bars
    const topicEntries = Object.entries(knowledgeState).filter(([key]) => 
      !['level', 'score', 'correct_streak', 'incorrect_streak', 'answered_questions'].includes(key)
    );

    // If no topic data is available, show a placeholder
    if (topicEntries.length === 0) {
      return (
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
          <Card sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Answer questions to see your knowledge progress
            </Typography>
          </Card>
        </Box>
      );
    }

    return (
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
          {topicEntries.map(([topic, data]) => {
            // Calculate progress percentage safely
            const progressValue = typeof data === 'object' && data !== null 
              ? (data.level ? Math.min(Math.max(data.level * 100, 0), 100) : 0)
              : (typeof data === 'number' ? Math.min(Math.max(data * 100, 0), 100) : 0);
            
            // Get status text safely
            const statusText = typeof data === 'object' && data !== null && data.status 
              ? data.status 
              : progressValue < 33 ? 'Beginner' : progressValue < 66 ? 'Intermediate' : 'Advanced';
            
            // Get explanation safely
            const explanation = typeof data === 'object' && data !== null && data.explanation
              ? data.explanation
              : '';

            return (
              <Grow key={topic} in={true}>
                <Card sx={{ 
                  p: 2, 
                  height: '100%',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 6px 16px rgba(0,0,0,0.1)',
                  }
                }}>
                  <Typography variant="body1" fontWeight="medium" gutterBottom>
                    {topic}
                  </Typography>
                  <ProgressBar 
                    variant="determinate" 
                    value={progressValue} 
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: 'rgba(0,0,0,0.05)',
                      '& .MuiLinearProgress-bar': {
                        borderRadius: 4,
                        background: `linear-gradient(90deg, 
                          ${progressValue < 33 ? '#64B5F6' : progressValue < 66 ? '#4CAF50' : '#FFA726'}, 
                          ${progressValue < 33 ? '#2196F3' : progressValue < 66 ? '#388E3C' : '#FB8C00'})`
                      }
                    }}
                  />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                    <Typography variant="caption" color="text.secondary">
                      Status: {statusText}
                    </Typography>
                    <Typography variant="caption" fontWeight="medium">
                      {Math.round(progressValue)}% Mastery
                    </Typography>
                  </Box>
                  {explanation && (
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                      {explanation}
                    </Typography>
                  )}
                </Card>
              </Grow>
            );
          })}
        </Box>
        
        {/* Overall Progress */}
        <Card sx={{ mt: 3, p: 2, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
          <Typography variant="body2" fontWeight="medium" gutterBottom>
            Overall Progress
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ flexGrow: 1 }}>
              <ProgressBar 
                variant="determinate" 
                value={Math.min((knowledgeState.answered_questions?.length || 0) * 10, 100)} 
                sx={{
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: 'rgba(0,0,0,0.05)',
                  '& .MuiLinearProgress-bar': {
                    borderRadius: 4,
                    background: 'linear-gradient(90deg, #0A66C2, #0b7ad4)'
                  }
                }}
              />
            </Box>
            <Typography variant="body2" fontWeight="medium">
              {knowledgeState.answered_questions?.length || 0}/{TOTAL_QUESTIONS}
            </Typography>
          </Box>
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
            Score: {knowledgeState.score || 0} points
          </Typography>
        </Card>
      </Box>
    );
  };

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
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Grid container spacing={3}>
          {/* Left column - Question */}
          <Grid item xs={12} md={8}>
            <QuestionCard elevation={3}>
              <CardContent sx={{ p: { xs: 2, sm: 4 } }}>
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
                        <Box sx={{ 
                          mb: 3, 
                          p: 3, 
                          borderRadius: 2, 
                          bgcolor: 'rgba(10, 102, 194, 0.05)',
                          border: '1px solid rgba(10, 102, 194, 0.1)'
                        }}>
                          <Typography 
                            variant="h5" 
                            gutterBottom
                            sx={{ 
                              fontWeight: 500,
                              color: 'text.primary',
                              lineHeight: 1.4
                            }}
                          >
                              {question.text}
                          </Typography>
                          
                          {question.code && (
                            <Box 
                              component="pre" 
                              sx={{ 
                                mt: 2,
                                p: 2, 
                                borderRadius: 1, 
                                bgcolor: 'grey.900',
                                color: 'common.white',
                                overflowX: 'auto',
                                fontSize: '0.9rem',
                                fontFamily: 'monospace'
                              }}
                            >
                              <code>{question.code}</code>
                            </Box>
                          )}
                        </Box>
                        
                        <Typography 
                          variant="subtitle1" 
                          sx={{ 
                            mb: 2, 
                            fontWeight: 500,
                            color: 'text.secondary' 
                          }}
                        >
                          Select the correct answer:
                        </Typography>
                        
                        <Box sx={{ my: 3 }}>
                            {question.options.map((option, index) => (
                                <Fade in={true} key={index} style={{ transitionDelay: `${index * 50}ms` }}>
                                    <Button
                                        fullWidth
                                        variant={selectedAnswer === index ? "contained" : "outlined"}
                                        onClick={() => setSelectedAnswer(index)}
                                        disabled={feedback !== null || isSubmitting}
                                        sx={{ 
                                            mt: 1.5,
                                            p: 2,
                                            justifyContent: 'flex-start',
                                            textAlign: 'left',
                                            borderRadius: 2,
                                            textTransform: 'none',
                                            fontWeight: 'normal',
                                            fontSize: '1rem',
                                            lineHeight: 1.5,
                                            position: 'relative',
                                            borderColor: selectedAnswer === index ? 'primary.main' : 'grey.300',
                                            bgcolor: selectedAnswer === index ? 'primary.main' : 
                                                    (feedback && index === question.correctAnswer) ? 'success.light' :
                                                    (feedback && selectedAnswer === index) ? 'error.light' : 'background.paper',
                                            color: selectedAnswer === index ? 'white' : 
                                                  (feedback && (index === question.correctAnswer || selectedAnswer === index)) ? 'white' : 'text.primary',
                                            '&:hover': {
                                                bgcolor: selectedAnswer === index ? 'primary.dark' : 'rgba(0, 0, 0, 0.04)',
                                            },
                                            '&.Mui-disabled': {
                                                opacity: 0.8,
                                                color: feedback ? (
                                                    index === question.correctAnswer ? 'white' :
                                                    selectedAnswer === index ? 'white' : 'text.primary'
                                                ) : 'text.disabled'
                                            }
                                        }}
                                    >
                                        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                                            <Box 
                                                sx={{ 
                                                    minWidth: 28, 
                                                    height: 28, 
                                                    borderRadius: '50%', 
                                                    display: 'flex', 
                                                    alignItems: 'center', 
                                                    justifyContent: 'center',
                                                    mr: 2,
                                                    bgcolor: selectedAnswer === index ? 'white' : 'primary.main',
                                                    color: selectedAnswer === index ? 'primary.main' : 'white',
                                                    fontWeight: 'bold'
                                                }}
                                            >
                                                {String.fromCharCode(65 + index)}
                                            </Box>
                                            <Typography 
                                                variant="body1" 
                                                sx={{ 
                                                    flexGrow: 1,
                                                    fontWeight: selectedAnswer === index ? 500 : 400
                                                }}
                                            >
                                                {option}
                                            </Typography>
                                            {feedback && index === question.correctAnswer && (
                                                <CheckCircleOutline sx={{ ml: 1, color: 'success.main' }} />
                                            )}
                                            {feedback && selectedAnswer === index && index !== question.correctAnswer && (
                                                <CancelOutlined sx={{ ml: 1, color: 'error.main' }} />
                                            )}
                                        </Box>
                                    </Button>
                                </Fade>
                            ))}
                        </Box>

                        {feedback && (
                            <Fade in={true}>
                                <Box sx={{ 
                                    mt: 3, 
                                    p: 3, 
                                    bgcolor: feedback.isCorrect ? 'rgba(76, 175, 80, 0.1)' : 'rgba(244, 67, 54, 0.1)',
                                    borderRadius: 2,
                                    border: `1px solid ${feedback.isCorrect ? 'rgba(76, 175, 80, 0.3)' : 'rgba(244, 67, 54, 0.3)'}`,
                                }}>
                                    <Typography variant="h6" color={feedback.isCorrect ? 'success.main' : 'error.main'} gutterBottom>
                                        {feedback.isCorrect ? '✓ Correct!' : '✗ Incorrect'}
                                    </Typography>
                                    <Typography variant="body1">
                                        {feedback.explanation}
                                    </Typography>
                                </Box>
                            </Fade>
                        )}

                        {/* Submit/Next button - now positioned within the card */}
                        <Box sx={{ 
                          display: 'flex', 
                          justifyContent: 'center',
                          mt: 4,
                          mb: 2
                        }}>
                          {error && (
                            <Fade in={true}>
                              <Alert 
                                severity="error" 
                                sx={{ 
                                  position: 'absolute', 
                                  bottom: '100%', 
                                  mb: 2, 
                                  width: 'calc(100% - 48px)',
                                  maxWidth: '600px',
                                  boxShadow: 2
                                }}
                                onClose={() => setError(null)}
                              >
                                {error}
                              </Alert>
                            </Fade>
                          )}
                          
                          <Button
                              variant="contained"
                              onClick={feedback ? handleNextQuestion : () => submitAnswer(selectedAnswer)}
                              disabled={(!feedback && selectedAnswer === null) || isSubmitting}
                              sx={{ 
                                  minWidth: 200,
                                  py: 1.5,
                                  px: 3,
                                  fontSize: '1rem',
                                  fontWeight: 500,
                                  background: feedback 
                                    ? 'linear-gradient(45deg, #4caf50, #45a049)'
                                    : 'linear-gradient(45deg, #0A66C2, #0b7ad4)',
                                  boxShadow: 3,
                                  borderRadius: 2,
                                  color: '#ffffff',
                                  '&:hover': {
                                    background: feedback 
                                      ? 'linear-gradient(45deg, #45a049, #3d8b3d)'
                                      : 'linear-gradient(45deg, #0b7ad4, #0A66C2)',
                                    boxShadow: 6,
                                    transform: 'translateY(-2px)'
                                  },
                                  '&.Mui-disabled': {
                                    background: 'rgba(0, 0, 0, 0.12)',
                                    color: 'rgba(0, 0, 0, 0.26)'
                                  },
                                  transition: 'all 0.2s'
                              }}
                              startIcon={feedback ? <NavigateNext /> : null}
                              endIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : null}
                          >
                              {isSubmitting ? 'Submitting...' : feedback ? 'Next Question' : 'Submit Answer'}
                          </Button>
                        </Box>
                    </>
                ) : (
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                        <CircularProgress />
                    </Box>
                )}
              </CardContent>
            </QuestionCard>
          </Grid>
          
          {/* Right column - Knowledge Progress */}
          <Grid item xs={12} md={4}>
            <Box sx={{ 
              position: { md: 'sticky' },
              top: { md: 24 },
              maxHeight: { md: 'calc(100vh - 48px)' },
              overflow: 'auto'
            }}>
              <Card elevation={3} sx={{ mb: 2 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ 
                    background: 'linear-gradient(45deg, #0A66C2, #0b7ad4)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    color: 'transparent',
                    fontWeight: 'bold'
                  }}>
                    Quiz Progress
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Typography variant="body2">
                      Question {questionNumber} of {TOTAL_QUESTIONS}
                    </Typography>
                    <LinearProgress 
                      variant="determinate" 
                      value={(questionNumber / TOTAL_QUESTIONS) * 100}
                      sx={{ flexGrow: 1, height: 6, borderRadius: 3 }} 
                    />
                  </Box>
                  {finalStats && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="body2">
                        Accuracy: {Math.round(finalStats.accuracy * 100)}%
                      </Typography>
                      <LinearProgress 
                        variant="determinate" 
                        value={finalStats.accuracy * 100}
                        sx={{ 
                          flexGrow: 1, 
                          height: 6, 
                          borderRadius: 3,
                          '& .MuiLinearProgress-bar': {
                            backgroundColor: 'success.main'
                          }
                        }} 
                      />
                    </Box>
                  )}
                </CardContent>
              </Card>
              
              {/* Knowledge State Cards */}
              {renderKnowledgeState()}
            </Box>
          </Grid>
        </Grid>
      </motion.div>
    </Container>
  );
};

export default AdaptiveQuiz; 