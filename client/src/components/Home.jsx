import React from 'react';
import { 
  Container, Box, Typography, Button, Grid,
  Card, useTheme, Divider 
} from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  CodeRounded as CodeIcon,
  AutoFixHigh as AdaptiveIcon,
  Analytics as AnalyticsIcon,
  Psychology as LearningIcon
} from '@mui/icons-material';

const FeatureHighlight = ({ icon, title, description, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay }}
  >
    <Card
      elevation={0}
      sx={{
        p: 3,
        height: '100%',
        background: 'transparent',
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 3,
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          borderColor: 'transparent'
        }
      }}
    >
      <Box sx={{ color: 'primary.main', mb: 2 }}>
        {icon}
      </Box>
      <Typography variant="h6" gutterBottom fontWeight="bold">
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {description}
      </Typography>
    </Card>
  </motion.div>
);

const Home = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const features = [
    {
      icon: <AdaptiveIcon sx={{ fontSize: 36 }} />,
      title: "Adaptive Difficulty",
      description: "Questions automatically adjust based on your performance, ensuring optimal learning progression"
    },
    {
      icon: <AnalyticsIcon sx={{ fontSize: 36 }} />,
      title: "Real-time Progress",
      description: "Track your mastery across different Python topics with detailed performance analytics"
    },
    {
      icon: <LearningIcon sx={{ fontSize: 36 }} />,
      title: "Smart Learning",
      description: "Receive personalized feedback and explanations tailored to your understanding"
    }
  ];

  return (
    <Container maxWidth="lg">
      {/* Hero Section */}
      <Box 
        sx={{ 
          minHeight: '70vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          py: { xs: 4, md: 8 }
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Box sx={{ mb: 6 }}>
            <CodeIcon 
              sx={{ 
                fontSize: 60, 
                color: 'primary.main',
                mb: 3
              }} 
            />
            <Typography 
              variant="h2" 
              component="h1"
              sx={{ 
                fontWeight: 700,
                background: 'linear-gradient(45deg, #0A66C2, #0b7ad4)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
                mb: 3,
                fontSize: { xs: '2.5rem', md: '3.75rem' }
              }}
            >
              Master Python with
              <br />
              Adaptive Learning
            </Typography>
            
            <Typography 
              variant="h5" 
              color="text.secondary"
              sx={{ 
                maxWidth: 600, 
                mx: 'auto',
                mb: 5,
                fontSize: { xs: '1.25rem', md: '1.5rem' }
              }}
            >
              Take our 10-question adaptive quiz to assess and improve
              your Python programming skills
            </Typography>

            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/quiz')}
              sx={{
                py: 2,
                px: 8,
                fontSize: '1.2rem',
                borderRadius: 2,
                background: 'linear-gradient(45deg, #0A66C2, #0b7ad4)',
                boxShadow: '0 4px 20px rgba(10, 102, 194, 0.25)',
                textTransform: 'none',
                '&:hover': {
                  background: 'linear-gradient(45deg, #085294, #0A66C2)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 25px rgba(10, 102, 194, 0.3)',
                },
                transition: 'all 0.3s ease'
              }}
            >
              Start Quiz
            </Button>
          </Box>
        </motion.div>
      </Box>

      <Divider sx={{ my: 4 }} />

      {/* Features Section */}
      <Box sx={{ py: 4 }}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          <Typography 
            variant="h6" 
            align="center" 
            gutterBottom
            sx={{
              color: 'text.secondary',
              fontWeight: 500,
              mb: 6
            }}
          >
            How it works
          </Typography>
          
          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} md={4} key={index}>
                <FeatureHighlight {...feature} delay={0.3 + index * 0.1} />
              </Grid>
            ))}
          </Grid>
        </motion.div>
      </Box>

      {/* Bottom Quote */}
      <Box 
        component={motion.div}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        sx={{ 
          mt: 8,
          mb: 4,
          p: 4,
          borderRadius: 4,
          bgcolor: 'rgba(10, 102, 194, 0.04)',
          maxWidth: 800,
          mx: 'auto',
          textAlign: 'center'
        }}
      >
        <Typography 
          variant="body1" 
          color="text.secondary"
          sx={{ 
            fontStyle: 'italic',
            fontSize: '1.1rem'
          }}
        >
          "Our intelligent system analyzes your responses in real-time,
          creating a personalized learning path that evolves with your understanding."
        </Typography>
      </Box>
    </Container>
  );
};

export default Home; 