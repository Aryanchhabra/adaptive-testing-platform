import React, { useState, useEffect } from 'react';
import { 
  Container, Paper, Typography, Box, Avatar, Card, CardContent,
  Divider, CircularProgress, List, ListItem, Grid,
  ListItemText, Chip, Button, Alert, useTheme, alpha
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../contexts/AuthContext';
import AuthRedirect from './AuthRedirect';
import { 
  Refresh as RefreshIcon, 
  EmojiEvents as TrophyIcon,
  BarChart as ChartIcon,
  School as SchoolIcon 
} from '@mui/icons-material';

function Profile() {
  const { user, loading, logout } = useAuthContext();
  const navigate = useNavigate();
  const [quizHistory, setQuizHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [error, setError] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const theme = useTheme();

  // Redirect if not logged in
  useEffect(() => {
    if (!loading && !user) {
      navigate('/signup');
    }
  }, [user, loading, navigate]);

  // Fetch quiz history and generate data on component mount
  useEffect(() => {
    if (user) {
      // Try to get the latest user info from localStorage first
      refreshUserFromStorage();
      
      // Now fetch quiz history
      fetchQuizHistory();
    }
  }, [user]);

  // Helper function to get updated user data from storage
  const refreshUserFromStorage = () => {
    const storedData = localStorage.getItem('userData');
    if (storedData) {
      try {
        const userData = JSON.parse(storedData);
        if (userData && userData.displayName && userData.email) {
          // If we have updated user data, update the UI
          setQuizHistory(userData.quiz_history || []);
        }
      } catch (e) {
        console.error('Error parsing stored user data:', e);
      }
    }
  };

  const fetchQuizHistory = async () => {
    try {
      setLoadingHistory(true);
      setError(null);
      
      // Check if we have quiz history in localStorage
      const storedData = localStorage.getItem('userData');
      if (storedData) {
        try {
          const userData = JSON.parse(storedData);
          if (userData && userData.quiz_history && userData.quiz_history.length > 0) {
            console.log('Using real quiz history from localStorage:', userData.quiz_history);
            setQuizHistory(userData.quiz_history);
            setLoadingHistory(false);
            return;
          }
        } catch (e) {
          console.error('Error parsing stored user data:', e);
        }
      }
      
      // Attempt to fetch quiz history from server as fallback
      try {
        const response = await fetch('/api/user/quiz-history', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          setQuizHistory(data.history || []);
          
          // Update local user data
          if (data.history && data.history.length > 0) {
            const updatedUser = { ...user, quiz_history: data.history };
            localStorage.setItem('userData', JSON.stringify(updatedUser));
          }
        } else {
          console.warn('Failed to fetch quiz history from server, no history to display');
          setQuizHistory([]); // Set empty array instead of generating mock data
        }
      } catch (error) {
        console.error('Error fetching quiz history:', error);
        setQuizHistory([]); // Set empty array instead of generating mock data
      }
      
      setLoadingHistory(false);
    } catch (err) {
      console.error('Error in quiz history logic:', err);
      setError('Failed to load quiz history');
      setLoadingHistory(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const refreshProfile = () => {
    setRefreshKey(prev => prev + 1);
    refreshUserFromStorage();
  };

  // Calculate user stats for dashboard
  const calculateStats = () => {
    const totalQuizzes = quizHistory.length;
    const totalQuestions = quizHistory.reduce((sum, quiz) => sum + (quiz.questions || 0), 0);
    const averageScore = totalQuizzes > 0 
      ? Math.round(quizHistory.reduce((sum, quiz) => sum + quiz.score, 0) / totalQuizzes) 
      : 0;
    
    // Calculate mastery level based on knowledge state
    let masteryPercentage = 0;
    if (user.knowledge_state && Object.keys(user.knowledge_state).length > 0) {
      const topicLevels = Object.values(user.knowledge_state)
        .filter(item => typeof item === 'object' && item !== null && typeof item.level === 'number')
        .map(item => item.level);
      
      if (topicLevels.length > 0) {
        masteryPercentage = Math.round(topicLevels.reduce((sum, level) => sum + level, 0) * 100 / topicLevels.length);
      }
    }
    
    return {
      totalQuizzes,
      totalQuestions,
      averageScore,
      masteryPercentage
    };
  };

  if (loading) {
    return (
      <Container sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (!user) return null;
  
  const stats = calculateStats();

  return (
    <>
      <AuthRedirect />
      
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Header with user info */}
        <Paper 
          elevation={0} 
          sx={{ 
            p: 4, 
            borderRadius: 2,
            mb: 3,
            background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
            color: 'white'
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Avatar 
                src={user.photoURL} 
                alt={user.displayName || user.email}
                sx={{ 
                  width: 100, 
                  height: 100, 
                  mr: 3,
                  border: '4px solid white'
                }}
              >
                {(user.displayName || user.email || '?').charAt(0).toUpperCase()}
              </Avatar>
              <Box>
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                  Welcome, {user.displayName || (user.email ? user.email.split('@')[0] : 'Learner')}!
                </Typography>
                <Typography variant="body1">
                  {user.email}
                </Typography>
                <Box sx={{ mt: 1 }}>
                  {user.isAdmin && (
                    <Chip 
                      label="Admin" 
                      color="secondary" 
                      size="small" 
                      sx={{ mr: 1, bgcolor: 'white', color: theme.palette.secondary.main }}
                    />
                  )}
                  <Chip 
                    label={`Overall Mastery: ${stats.masteryPercentage}%`} 
                    variant="outlined" 
                    size="small"
                    sx={{ borderColor: 'white', color: 'white' }}
                  />
                </Box>
              </Box>
            </Box>
            
            <Button 
              startIcon={<RefreshIcon />}
              onClick={refreshProfile}
              variant="contained"
              sx={{ 
                bgcolor: 'rgba(255,255,255,0.2)',
                '&:hover': {
                  bgcolor: 'rgba(255,255,255,0.3)',
                }
              }}
            >
              Refresh Profile
            </Button>
          </Box>
        </Paper>
        
        {/* Dashboard Stats */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={4}>
            <Card sx={{ height: '100%' }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <TrophyIcon sx={{ fontSize: 40, color: theme.palette.primary.main, mb: 1 }} />
                <Typography variant="h5" fontWeight="medium">{stats.totalQuizzes}</Typography>
                <Typography variant="body2" color="text.secondary">Quizzes Completed</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card sx={{ height: '100%' }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <ChartIcon sx={{ fontSize: 40, color: theme.palette.secondary.main, mb: 1 }} />
                <Typography variant="h5" fontWeight="medium">{stats.averageScore}%</Typography>
                <Typography variant="body2" color="text.secondary">Average Score</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card sx={{ height: '100%' }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <SchoolIcon sx={{ fontSize: 40, color: theme.palette.success.main, mb: 1 }} />
                <Typography variant="h5" fontWeight="medium">{stats.totalQuestions}</Typography>
                <Typography variant="body2" color="text.secondary">Questions Answered</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        
        {/* Main content */}
        <Grid container spacing={3}>
          {/* Knowledge Areas */}
          <Grid item xs={12} md={7}>
            <Paper elevation={0} sx={{ p: 3, borderRadius: 2, border: '1px solid', borderColor: 'divider', height: '100%' }}>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <SchoolIcon sx={{ mr: 1 }} /> Knowledge Areas
              </Typography>
              <Divider sx={{ mb: 3 }} />

              {user.knowledge_state && Object.keys(user.knowledge_state).length > 0 ? (
                <Box sx={{ mb: 3 }}>
                  {Object.entries(user.knowledge_state)
                    .filter(([key]) => !['level', 'score', 'correct_streak', 'incorrect_streak', 'answered_questions'].includes(key))
                    .map(([topic, data]) => {
                      const level = typeof data === 'object' && data !== null 
                        ? (data.level ? data.level * 100 : 0)
                        : (typeof data === 'number' ? data * 100 : 0);
                      
                      let statusText, statusColor;
                      
                      if (level < 33) {
                        statusText = 'Beginner';
                        statusColor = theme.palette.warning.main;
                      } else if (level < 66) {
                        statusText = 'Intermediate';
                        statusColor = theme.palette.info.main;
                      } else {
                        statusText = 'Advanced';
                        statusColor = theme.palette.success.main;
                      }
                      
                      return (
                        <Box key={topic} sx={{ mb: 2 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                            <Typography variant="body2" fontWeight="medium">{topic}</Typography>
                            <Typography variant="body2" sx={{ color: statusColor, fontWeight: 'bold' }}>
                              {statusText} ({Math.round(level)}%)
                            </Typography>
                          </Box>
                          <Box 
                            sx={{
                              height: 8,
                              borderRadius: 4,
                              bgcolor: alpha(statusColor, 0.1),
                              position: 'relative',
                              overflow: 'hidden'
                            }}
                          >
                            <Box
                              sx={{
                                position: 'absolute',
                                left: 0,
                                top: 0,
                                height: '100%',
                                width: `${level}%`,
                                bgcolor: statusColor,
                                borderRadius: 4
                              }}
                            />
                          </Box>
                        </Box>
                      );
                    })}
                </Box>
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 4 }}>
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                    No knowledge data available yet. Take a quiz to start tracking your progress!
                  </Typography>
                  <Button 
                    variant="contained" 
                    color="primary" 
                    onClick={() => navigate('/quiz')}
                  >
                    Start Quiz
                  </Button>
                </Box>
              )}
            </Paper>
          </Grid>
          
          {/* Quiz History */}
          <Grid item xs={12} md={5}>
            <Paper elevation={0} sx={{ p: 3, borderRadius: 2, border: '1px solid', borderColor: 'divider', height: '100%' }}>
              <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
                  <ChartIcon sx={{ mr: 1 }} /> Quiz History
                </Typography>
                <Button 
                  variant="contained" 
                  color="primary"
                  size="small" 
                  onClick={() => navigate('/quiz')}
                >
                  Start New Quiz
                </Button>
              </Box>
              <Divider sx={{ mb: 3 }} />

              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}

              {loadingHistory ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
                  <CircularProgress size={28} />
                </Box>
              ) : quizHistory.length > 0 ? (
                <List>
                  {quizHistory.map((quiz) => (
                    <ListItem 
                      key={quiz.id}
                      sx={{ 
                        border: '1px solid', 
                        borderColor: 'divider', 
                        borderRadius: 1,
                        mb: 1,
                        transition: 'all 0.2s',
                        '&:hover': {
                          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                          borderColor: theme.palette.primary.main
                        }
                      }}
                    >
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="body1" fontWeight="medium">Quiz on {quiz.date}</Typography>
                            <Chip 
                              label={`${quiz.score}%`} 
                              color={quiz.score >= 80 ? 'success' : quiz.score >= 60 ? 'primary' : 'warning'} 
                              size="small" 
                            />
                          </Box>
                        }
                        secondary={
                          <Box sx={{ mt: 1 }}>
                            <Typography variant="body2" color="text.secondary">
                              Topics: {quiz.topics.join(', ')}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {quiz.questions} questions
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', py: 4 }}>
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 3, textAlign: 'center' }}>
                    You haven't taken any quizzes yet. Take your first quiz to track your progress!
                  </Typography>
                  <Button 
                    variant="contained" 
                    color="primary"
                    onClick={() => navigate('/quiz')}
                    startIcon={<SchoolIcon />}
                  >
                    Start Your First Quiz
                  </Button>
                </Box>
              )}
            </Paper>
          </Grid>
        </Grid>
        
        {/* Footer with logout button */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Button 
            variant="outlined" 
            color="error" 
            onClick={handleLogout}
          >
            Logout
          </Button>
        </Box>
      </Container>
    </>
  );
}

export default Profile; 