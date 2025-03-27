import React from 'react';
import { 
  Box, Typography, Button, List, 
  ListItem, ListItemIcon, ListItemText,
  Paper, Fade
} from '@mui/material';
import {
  Timer as TimerIcon,
  QuestionAnswer as QuestionIcon,
  TrendingUp as AdaptiveIcon,
  Psychology as FeedbackIcon,
  PlayArrow as StartIcon
} from '@mui/icons-material';

const QuizIntro = ({ onStartQuiz }) => {
  const quizDetails = [
    {
      icon: <QuestionIcon color="primary" />,
      text: "10 adaptive questions testing Python knowledge"
    },
    {
      icon: <AdaptiveIcon color="primary" />,
      text: "Questions adjust to your skill level"
    },
    {
      icon: <FeedbackIcon color="primary" />,
      text: "Detailed explanations for each answer"
    },
    {
      icon: <TimerIcon color="primary" />,
      text: "No time limit - focus on understanding"
    }
  ];

  return (
    <Fade in={true} timeout={800}>
      <Paper 
        elevation={3} 
        sx={{ 
          p: 4,
          maxWidth: 800,
          mx: 'auto',
          mt: 4,
          textAlign: 'center',
          borderRadius: 3,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          overflow: 'hidden',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '6px',
            background: 'linear-gradient(45deg, #0A66C2, #0b7ad4)',
          }
        }}
      >
        <Typography 
          variant="h4" 
          gutterBottom 
          fontWeight="bold"
          sx={{
            background: 'linear-gradient(45deg, #0A66C2, #0b7ad4)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            color: 'transparent',
            mb: 2
          }}
        >
          Python Knowledge Assessment
        </Typography>
        
        <Typography 
          variant="body1" 
          color="text.secondary" 
          sx={{ 
            mb: 4,
            maxWidth: '600px',
            mx: 'auto',
            fontSize: '1.1rem',
            lineHeight: 1.6
          }}
        >
          Test your Python programming skills with our adaptive quiz.
          The questions will adjust to your knowledge level as you progress.
        </Typography>

        <Box 
          sx={{ 
            mb: 4, 
            p: 3, 
            bgcolor: 'rgba(10, 102, 194, 0.05)', 
            borderRadius: 2,
            border: '1px solid rgba(10, 102, 194, 0.1)'
          }}
        >
          <List sx={{ mb: 0 }}>
            {quizDetails.map((detail, index) => (
              <ListItem key={index} sx={{ py: 1 }}>
                <ListItemIcon sx={{ minWidth: '40px' }}>
                  {detail.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={detail.text} 
                  primaryTypographyProps={{ 
                    fontWeight: 500,
                    fontSize: '1rem'
                  }} 
                />
              </ListItem>
            ))}
          </List>
        </Box>

        <Button
          variant="contained"
          size="large"
          onClick={onStartQuiz}
          startIcon={<StartIcon />}
          sx={{
            px: 6,
            py: 1.5,
            fontSize: '1.1rem',
            fontWeight: 600,
            background: 'linear-gradient(45deg, #0A66C2, #0b7ad4)',
            boxShadow: '0 4px 14px rgba(10, 102, 194, 0.4)',
            borderRadius: 2,
            '&:hover': {
              background: 'linear-gradient(45deg, #0b7ad4, #0A66C2)',
              boxShadow: '0 6px 20px rgba(10, 102, 194, 0.6)',
              transform: 'translateY(-2px)'
            },
            transition: 'all 0.3s ease'
          }}
        >
          Begin Quiz
        </Button>
      </Paper>
    </Fade>
  );
};

export default QuizIntro; 