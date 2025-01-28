import React from 'react';
import { Typography, Box, Container, Paper, Button, Grid } from '@mui/material';
import { Assessment, Psychology, Timeline, AutoGraph } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../contexts/AuthContext';

function FeatureCard({ icon, title, description }) {
  return (
    <Paper 
      elevation={0} 
      sx={{ 
        p: 3, 
        height: '100%',
        bgcolor: 'background.paper', 
        borderRadius: 4,
        border: '1px solid',
        borderColor: 'rgba(255,255,255,0.1)',
        transition: 'transform 0.2s',
        '&:hover': {
          transform: 'translateY(-5px)',
        }
      }}
    >
      <Box sx={{ color: 'primary.main', mb: 2 }}>
        {icon}
      </Box>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {description}
      </Typography>
    </Paper>
  );
}

function Home() {
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const features = [
    {
      icon: <Assessment sx={{ fontSize: 40 }} />,
      title: "Adaptive Testing",
      description: "Questions adapt to your skill level in real-time, providing a personalized assessment experience."
    },
    {
      icon: <Psychology sx={{ fontSize: 40 }} />,
      title: "AI-Powered Learning",
      description: "Advanced AI algorithms analyze your performance and provide tailored recommendations for improvement."
    },
    {
      icon: <Timeline sx={{ fontSize: 40 }} />,
      title: "Progress Tracking",
      description: "Monitor your learning journey with detailed analytics and progress reports."
    },
    {
      icon: <AutoGraph sx={{ fontSize: 40 }} />,
      title: "Performance Analytics",
      description: "Get insights into your strengths and areas for improvement with comprehensive performance analysis."
    }
  ];

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 8, textAlign: 'center' }}>
        <Typography 
          variant="h2" 
          component="h1" 
          gutterBottom 
          sx={{ 
            fontWeight: 700,
            '& span': {
              background: 'linear-gradient(45deg, #2dd4bf, #38bdf8)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
            }
          }}
        >
          <span>Transform Your Learning Journey</span>
        </Typography>
        <Typography variant="h5" color="text.secondary" paragraph sx={{ mb: 6, maxWidth: '800px', mx: 'auto' }}>
          Experience the future of education with our AI-powered adaptive testing platform
        </Typography>

        <Box sx={{ mb: 8, display: 'flex', gap: 2, justifyContent: 'center' }}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            sx={{
              background: 'linear-gradient(45deg, #2dd4bf, #38bdf8)',
              '&:hover': {
                background: 'linear-gradient(45deg, #2dd4bf, #38bdf8)',
                opacity: 0.9,
              }
            }}
          >
            Start Learning
          </Button>
          <Button
            variant="outlined"
            color="primary"
            size="large"
          >
            Watch Demo
          </Button>
        </Box>

        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <FeatureCard {...feature} />
            </Grid>
          ))}
        </Grid>

        {!user && (
          <Paper 
            elevation={0} 
            sx={{ 
              p: 6, 
              mt: 8,
              bgcolor: 'background.paper', 
              borderRadius: 4,
              border: '1px solid',
              borderColor: 'rgba(255,255,255,0.1)',
            }}
          >
            <Typography variant="h4" gutterBottom>
              Ready to Get Started?
            </Typography>
            <Typography variant="body1" paragraph sx={{ mb: 4 }}>
              Join thousands of students who are already experiencing the future of learning.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={() => navigate('/signup')}
              sx={{
                background: 'linear-gradient(45deg, #2dd4bf, #38bdf8)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #2dd4bf, #38bdf8)',
                  opacity: 0.9,
                }
              }}
            >
              Sign Up Now
            </Button>
          </Paper>
        )}
      </Box>
    </Container>
  );
}

export default Home; 