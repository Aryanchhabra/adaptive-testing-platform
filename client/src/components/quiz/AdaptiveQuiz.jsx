import React, { useState, useEffect } from 'react';
import { 
  Box, Container, Typography, Button, Paper, 
  RadioGroup, FormControlLabel, Radio,
  CircularProgress, LinearProgress, Alert,
  Card, CardContent, Fade, Grow, Grid, Chip
} from '@mui/material';
import { motion } from 'framer-motion';
import { styled } from '@mui/material/styles';
import QuizIntro from './QuizIntro';
import QuizSummary from './QuizSummary';
import QuizComplete from './QuizComplete';
import { CheckCircleOutline, CancelOutlined, NavigateNext, TrendingUp, School } from '@mui/icons-material';

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
  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
  display: 'flex',
  flexDirection: 'column',
  position: 'relative'
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

const KnowledgeCard = styled(Card)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.spacing(2),
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
  marginBottom: theme.spacing(2)
}));

const StickyFooter = styled(Box)(({ theme }) => ({
  position: 'sticky',
  bottom: 0,
  left: 0,
  width: '100%',
  backgroundColor: theme.palette.background.paper,
  boxShadow: '0 -2px 10px rgba(0, 0, 0, 0.05)',
  padding: theme.spacing(2),
  zIndex: 2,
  borderTop: '1px solid rgba(0, 0, 0, 0.06)',
  marginTop: 'auto'
}));

const FloatingButton = styled(Button)(({ theme, color = 'primary' }) => ({
  padding: '12px 24px',
  borderRadius: theme.spacing(1.5),
  fontSize: '1rem',
  fontWeight: 500,
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
  transition: 'all 0.2s ease',
  '&:hover': {
    boxShadow: '0 6px 16px rgba(0, 0, 0, 0.2)',
    transform: 'translateY(-2px)'
  }
}));

const ButtonArea = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  padding: theme.spacing(2, 3),
  borderTop: '1px solid rgba(0, 0, 0, 0.06)',
  marginTop: 'auto',
  borderBottomLeftRadius: theme.spacing(2),
  borderBottomRightRadius: theme.spacing(2),
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
        
        console.log("Attempting to start quiz...");
        
        let retryCount = 0;
        const maxRetries = 3;
        let success = false;
        
        while (!success && retryCount < maxRetries) {
            try {
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
                
                const response = await fetch('/api/start-quiz', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    signal: controller.signal
                });
                
                clearTimeout(timeoutId);
                
                console.log("API Response Status:", response.status);
                
                if (!response.ok) {
                    const errorText = await response.text();
                    console.error('Server error response:', errorText);
                    throw new Error(`Server error: ${response.status} ${response.statusText} - ${errorText}`);
                }
                
                const responseData = await response.text();
                console.log("Raw API response:", responseData.substring(0, 100) + "...");
                
                let data;
                try {
                    data = JSON.parse(responseData);
                    console.log("Parsed JSON data:", 
                        data ? "Success" : "No data", 
                        data?.session_id ? `Session ID: ${data.session_id}` : "No session ID"
                    );
                } catch (jsonError) {
                    console.error("Failed to parse JSON:", jsonError, "Raw text:", responseData.substring(0, 100) + "...");
                    throw new Error(`Invalid JSON response: ${jsonError.message}`);
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
                    console.log("Quiz started successfully with question ID:", data.question.id);
                    success = true;
                } else {
                    throw new Error('No question received from server');
                }
            } catch (err) {
                retryCount++;
                console.error(`Attempt ${retryCount} failed: ${err.message}`);
                
                if (retryCount >= maxRetries) {
                    throw err;
                }
                
                // Wait before retrying (exponential backoff)
                await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
            }
        }
    } catch (err) {
        console.error('Error starting quiz:', err);
        setError(`Failed to start quiz: ${err.message || 'Unknown error'}. Please try again.`);
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
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            '&:after': {
              content: '""',
              height: '2px',
              flexGrow: 1,
              ml: 2,
              background: 'linear-gradient(90deg, rgba(10, 102, 194, 0.5), rgba(10, 102, 194, 0.1))'
            }
          }}>
            Knowledge Progress
          </Typography>
          <KnowledgeCard sx={{ p: 3, textAlign: 'center' }}>
            <Box sx={{ 
              p: 3, 
              borderRadius: 2, 
              bgcolor: 'rgba(10, 102, 194, 0.03)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column'
            }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Answer questions to see your knowledge progress
              </Typography>
              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                <School sx={{ fontSize: 40, color: 'rgba(10, 102, 194, 0.3)' }} />
              </motion.div>
            </Box>
          </KnowledgeCard>
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
          fontWeight: 'bold',
          display: 'flex',
          alignItems: 'center',
          '&:after': {
            content: '""',
            height: '2px',
            flexGrow: 1,
            ml: 2,
            background: 'linear-gradient(90deg, rgba(10, 102, 194, 0.5), rgba(10, 102, 194, 0.1))'
          }
        }}>
          Knowledge Progress
        </Typography>
        <Box sx={{ 
          display: 'grid', 
          gap: 2.5,
          gridTemplateColumns: { xs: '1fr', md: 'repeat(1, 1fr)' }
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
              
            // Determine the color based on progress
            let color = '#ff9800'; // Beginner - Orange
            if (progressValue >= 66) {
              color = '#4caf50'; // Advanced - Green
            } else if (progressValue >= 33) {
              color = '#03a9f4'; // Intermediate - Blue
            }

            return (
              <Grow key={topic} in={true}>
                <KnowledgeCard sx={{ 
                  p: 2.5, 
                  position: 'relative',
                  overflow: 'visible',
                  '&:after': {
                    content: '""',
                    position: 'absolute',
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    backgroundColor: color,
                    top: 16,
                    right: 16,
                    boxShadow: `0 0 0 3px rgba(${color === '#4caf50' ? '76, 175, 80' : color === '#03a9f4' ? '3, 169, 244' : '255, 152, 0'}, 0.2)`,
                  }
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="body1" fontWeight="medium" sx={{ 
                      color: 'text.primary',
                      fontSize: '1rem',
                      lineHeight: 1.2
                    }}>
                      {topic}
                    </Typography>
                    <Chip 
                      label={statusText} 
                      size="small"
                      sx={{ 
                        bgcolor: color,
                        color: 'white',
                        fontSize: '0.75rem',
                        fontWeight: 'bold',
                        height: '24px',
                        ml: 1
                      }} 
                    />
                  </Box>
                  
                  <Box sx={{ mb: 1.5 }}>
                    <ProgressBar 
                      variant="determinate" 
                      value={progressValue} 
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: 'rgba(0,0,0,0.05)',
                        '& .MuiLinearProgress-bar': {
                          borderRadius: 4,
                          background: `linear-gradient(90deg, ${color}99, ${color})`
                        }
                      }}
                    />
                    <Box sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      mt: 0.5,
                      px: 0.5
                    }}>
                      <Typography variant="caption" color="text.secondary" fontWeight="medium">
                        {Math.round(progressValue)}%
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Proficiency
                      </Typography>
                    </Box>
                  </Box>
                  
                  {explanation && (
                    <Typography variant="caption" color="text.secondary" sx={{ 
                      display: 'block',
                      mt: 1,
                      fontSize: '0.75rem',
                      fontStyle: 'italic',
                      color: 'text.secondary',
                      lineHeight: 1.4
                    }}>
                      {explanation}
                    </Typography>
                  )}
                </KnowledgeCard>
              </Grow>
            );
          })}
        </Box>
        
        {/* Overall Progress */}
        <KnowledgeCard sx={{ mt: 2.5, p: 2.5, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
          <Typography variant="body1" fontWeight="medium" gutterBottom sx={{
            display: 'flex',
            alignItems: 'center',
            color: 'text.primary'
          }}>
            <TrendingUp sx={{ fontSize: 20, mr: 1, color: '#0A66C2' }} />
            Overall Progress
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1 }}>
            <Box sx={{ flexGrow: 1 }}>
              <ProgressBar 
                variant="determinate" 
                value={Math.min((knowledgeState.answered_questions?.length || 0) * 10, 100)} 
                sx={{
                  height: 10,
                  borderRadius: 5,
                  backgroundColor: 'rgba(0,0,0,0.05)',
                  '& .MuiLinearProgress-bar': {
                    borderRadius: 5,
                    background: 'linear-gradient(90deg, #0A66C2, #42a5f5)'
                  }
                }}
              />
            </Box>
            <Typography variant="body2" fontWeight="bold" sx={{ color: '#0A66C2' }}>
              {knowledgeState.answered_questions?.length || 0}/{TOTAL_QUESTIONS}
            </Typography>
          </Box>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            mt: 2,
            pt: 1.5, 
            borderTop: '1px solid rgba(0,0,0,0.06)' 
          }}>
            <Typography variant="body2" color="text.secondary">
              Current Score:
            </Typography>
            <Typography variant="body2" fontWeight="bold" sx={{ 
              color: '#0A66C2',
              bgcolor: 'rgba(10, 102, 194, 0.1)',
              px: 1.5,
              py: 0.5,
              borderRadius: 1
            }}>
              {knowledgeState.score || 0} points
            </Typography>
          </Box>
        </KnowledgeCard>
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
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Top navigation bar with progress */}
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          mb: 2,
          pb: 2,
          borderBottom: '1px solid rgba(0, 0, 0, 0.06)'
        }}>
          <Typography variant="h5" component="h1" sx={{ fontWeight: 600 }}>
            Adaptive Quiz
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2" fontWeight="medium" color="text.secondary">
              {questionNumber}/{TOTAL_QUESTIONS}
            </Typography>
            <LinearProgress 
              variant="determinate" 
              value={(questionNumber / TOTAL_QUESTIONS) * 100}
              sx={{ 
                width: 100,
                height: 8, 
                borderRadius: 4,
                mx: 1
              }} 
            />
            <Chip 
              label={`${knowledgeState.score || 0} pts`}
              size="small"
              color="primary"
              sx={{ fontWeight: 'bold' }}
            />
          </Box>
        </Box>

        <Grid container spacing={2}>
          {/* Main quiz content */}
          <Grid item xs={12} md={8}>
            <QuestionCard>
              {question ? (
                <>
                  {/* Question header with difficulty */}
                  <Box sx={{ 
                    p: 2, 
                    borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <Typography variant="subtitle1" fontWeight="medium">
                      Question {questionNumber}
                    </Typography>
                    <Chip 
                      size="small" 
                      label={`Difficulty: ${knowledgeState.level || 1}/3`}
                      color={knowledgeState.level > 2 ? "error" : knowledgeState.level > 1 ? "warning" : "primary"}
                      variant="outlined"
                    />
                  </Box>
                  
                  {/* Question content */}
                  <CardContent sx={{ p: 2, flexGrow: 1 }}>
                    {/* Question Text */}
                    <Box sx={{ 
                      mb: 2, 
                      p: 2, 
                      borderRadius: 2, 
                      bgcolor: 'rgba(10, 102, 194, 0.04)',
                      border: '1px solid rgba(10, 102, 194, 0.1)'
                    }}>
                      <Typography 
                        variant="h6" 
                        sx={{ fontWeight: 500, color: 'text.primary', lineHeight: 1.4 }}
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
                    
                    {/* Answer Options */}
                    <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 500 }}>
                      Select the correct answer:
                    </Typography>
                    
                    <Box sx={{ mb: 1 }}>
                      {question.options.map((option, index) => (
                        <Button
                          key={index}
                          fullWidth
                          variant={selectedAnswer === index ? "contained" : "outlined"}
                          onClick={() => setSelectedAnswer(index)}
                          disabled={feedback !== null || isSubmitting}
                          sx={{ 
                            mt: 1,
                            p: 1,
                            justifyContent: 'flex-start',
                            textAlign: 'left',
                            borderRadius: 2,
                            textTransform: 'none',
                            fontSize: '0.95rem',
                            borderColor: selectedAnswer === index ? 'primary.main' : 'grey.300',
                            bgcolor: selectedAnswer === index ? 'primary.main' : 
                                  (feedback && index === question.correctAnswer) ? 'success.light' :
                                  (feedback && selectedAnswer === index) ? 'error.light' : 'background.paper',
                            color: selectedAnswer === index ? 'white' : 
                                  (feedback && (index === question.correctAnswer || selectedAnswer === index)) ? 'white' : 'text.primary',
                          }}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                            <Box 
                              sx={{ 
                                minWidth: 24, 
                                height: 24, 
                                borderRadius: '50%', 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center',
                                mr: 1.5,
                                bgcolor: selectedAnswer === index ? 'white' : 'primary.main',
                                color: selectedAnswer === index ? 'primary.main' : 'white',
                                fontWeight: 'bold',
                                fontSize: '0.8rem'
                              }}
                            >
                              {String.fromCharCode(65 + index)}
                            </Box>
                            <Typography 
                              variant="body2" 
                              sx={{ 
                                flexGrow: 1,
                                fontWeight: selectedAnswer === index ? 500 : 400
                              }}
                            >
                              {option}
                            </Typography>
                            {feedback && index === question.correctAnswer && (
                              <CheckCircleOutline sx={{ ml: 1, color: 'success.main', fontSize: 20 }} />
                            )}
                            {feedback && selectedAnswer === index && index !== question.correctAnswer && (
                              <CancelOutlined sx={{ ml: 1, color: 'error.main', fontSize: 20 }} />
                            )}
                          </Box>
                        </Button>
                      ))}
                    </Box>

                    {/* Feedback */}
                    {feedback && (
                      <Fade in={true}>
                        <Box sx={{ 
                          mt: 2, 
                          p: 2, 
                          bgcolor: feedback.isCorrect ? 'rgba(76, 175, 80, 0.1)' : 'rgba(244, 67, 54, 0.1)',
                          borderRadius: 2,
                          border: `1px solid ${feedback.isCorrect ? 'rgba(76, 175, 80, 0.3)' : 'rgba(244, 67, 54, 0.3)'}`,
                        }}>
                          <Typography variant="subtitle1" color={feedback.isCorrect ? 'success.main' : 'error.main'} gutterBottom>
                            {feedback.isCorrect ? '✓ Correct!' : '✗ Incorrect'}
                          </Typography>
                          <Typography variant="body2">
                            {feedback.explanation}
                          </Typography>
                        </Box>
                      </Fade>
                    )}

                    {/* Error Message */}
                    {error && (
                      <Alert 
                        severity="error" 
                        sx={{ mt: 2 }}
                        onClose={() => setError(null)}
                      >
                        {error}
                      </Alert>
                    )}
                  </CardContent>

                  {/* Submit Button Area - integrated with the card */}
                  <ButtonArea>
                    <FloatingButton
                      variant="contained"
                      fullWidth
                      onClick={feedback ? handleNextQuestion : () => submitAnswer(selectedAnswer)}
                      disabled={(!feedback && selectedAnswer === null) || isSubmitting}
                      color={feedback ? "success" : "primary"}
                      size="large"
                      startIcon={feedback ? <NavigateNext /> : null}
                      endIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : null}
                    >
                      {isSubmitting ? 'Submitting...' : feedback ? 'Next Question' : 'Submit Answer'}
                    </FloatingButton>
                  </ButtonArea>
                </>
              ) : (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                  <CircularProgress />
                </Box>
              )}
            </QuestionCard>
          </Grid>
          
          {/* Sidebar - Knowledge Progress (Compact) */}
          <Grid item xs={12} md={4}>
            <Box sx={{ 
              position: { md: 'sticky' },
              top: { md: '1rem' },
              height: 'fit-content'
            }}>
              {/* Progress Card */}
              <KnowledgeCard sx={{ mb: 2 }}>
                <CardContent sx={{ p: 2 }}>
                  <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
                    Your Progress
                  </Typography>
                  <Box sx={{ mb: 1.5 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5, display: 'flex', justifyContent: 'space-between' }}>
                      <span>Questions completed</span>
                      <span>{knowledgeState.answered_questions?.length || 0}/{TOTAL_QUESTIONS}</span>
                    </Typography>
                    <LinearProgress 
                      variant="determinate" 
                      value={Math.min((knowledgeState.answered_questions?.length || 0) * 10, 100)} 
                      sx={{ height: 6, borderRadius: 3 }}
                    />
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2">Current Score:</Typography>
                    <Chip 
                      label={`${knowledgeState.score || 0} points`}
                      size="small"
                      color="primary"
                      sx={{ fontWeight: 'medium' }}
                    />
                  </Box>
                </CardContent>
              </KnowledgeCard>
              
              {/* Knowledge Areas */}
              {renderCompactKnowledgeState()}
            </Box>
          </Grid>
        </Grid>
      </motion.div>
    </Container>
  );

  // Create a more compact knowledge state renderer
  function renderCompactKnowledgeState() {
    // Skip rendering if knowledgeState is empty or not properly formatted
    if (!knowledgeState || Object.keys(knowledgeState).length === 0) {
      return null;
    }

    // Filter out non-topic keys
    const topicEntries = Object.entries(knowledgeState).filter(([key]) => 
      !['level', 'score', 'correct_streak', 'incorrect_streak', 'answered_questions'].includes(key)
    );

    // If no topic data is available, show nothing
    if (topicEntries.length === 0) {
      return null;
    }

    return (
      <KnowledgeCard>
        <CardContent sx={{ p: 2 }}>
          <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
            Knowledge Areas
          </Typography>
          
          <Box sx={{ maxHeight: { xs: 'none', md: '300px' }, overflowY: { md: 'auto' }, pr: { md: 1 } }}>
            {topicEntries.map(([topic, data]) => {
              // Calculate progress percentage safely
              const progressValue = typeof data === 'object' && data !== null 
                ? (data.level ? Math.min(Math.max(data.level * 100, 0), 100) : 0)
                : (typeof data === 'number' ? Math.min(Math.max(data * 100, 0), 100) : 0);
              
              // Get status text safely
              const statusText = typeof data === 'object' && data !== null && data.status 
                ? data.status 
                : progressValue < 33 ? 'Beginner' : progressValue < 66 ? 'Intermediate' : 'Advanced';

              // Choose color based on status
              const statusColor = 
                statusText === 'Advanced' ? '#4caf50' : 
                statusText === 'Intermediate' ? '#2196f3' : 
                '#ff9800';

              return (
                <Box key={topic} sx={{ mb: 1.5 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                    <Typography variant="body2" fontWeight="medium" sx={{ maxWidth: '70%', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {topic}
                    </Typography>
                    <Typography variant="caption" sx={{ 
                      color: statusColor,
                      fontWeight: 'medium',
                      fontSize: '0.7rem',
                      px: 1,
                      py: 0.3,
                      borderRadius: 1,
                      bgcolor: `${statusColor}20`,
                    }}>
                      {statusText}
                    </Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={progressValue} 
                    sx={{ 
                      height: 4, 
                      borderRadius: 2,
                      bgcolor: `${statusColor}20`,
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: statusColor
                      }
                    }}
                  />
                </Box>
              );
            })}
          </Box>
        </CardContent>
      </KnowledgeCard>
    );
  }
};

export default AdaptiveQuiz; 