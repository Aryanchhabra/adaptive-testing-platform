import React from 'react';
import { 
  Box, Typography, Button, List, 
  ListItem, ListItemIcon, ListItemText,
  Paper 
} from '@mui/material';
import {
  Timer as TimerIcon,
  QuestionAnswer as QuestionIcon,
  TrendingUp as AdaptiveIcon,
  Psychology as FeedbackIcon
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
    <Paper 
      elevation={3} 
      sx={{ 
        p: 4,
        maxWidth: 800,
        mx: 'auto',
        mt: 4,
        textAlign: 'center'
      }}
    >
      <Typography variant="h4" gutterBottom fontWeight="bold">
        Python Knowledge Assessment
      </Typography>
      
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Test your Python programming skills with our adaptive quiz.
        The questions will adjust to your knowledge level as you progress.
      </Typography>

      <List sx={{ mb: 4 }}>
        {quizDetails.map((detail, index) => (
          <ListItem key={index}>
            <ListItemIcon>
              {detail.icon}
            </ListItemIcon>
            <ListItemText primary={detail.text} />
          </ListItem>
        ))}
      </List>

      <Button
        variant="contained"
        size="large"
        onClick={onStartQuiz}
        sx={{
          px: 6,
          py: 1.5,
          fontSize: '1.1rem'
        }}
      >
        Begin Quiz
      </Button>
    </Paper>
  );
};

export default QuizIntro; 