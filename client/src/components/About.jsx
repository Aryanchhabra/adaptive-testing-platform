import React from 'react';
import { Typography, Box, Container, Paper, Grid, Divider } from '@mui/material';
import { styled } from '@mui/material/styles';
import { alpha } from '@mui/material/styles';

// Styled components for consistent styling
const GradientText = styled(Typography)(({ theme }) => ({
  background: 'linear-gradient(45deg, #2196F3, #64B5F6)',
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  color: 'transparent',
  fontWeight: 700,
  textShadow: '0 2px 10px rgba(33, 150, 243, 0.3)',
}));

const SectionPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  backgroundColor: alpha(theme.palette.background.paper, 0.8),
  backdropFilter: 'blur(10px)',
  borderRadius: theme.spacing(2),
  border: '1px solid',
  borderColor: theme.palette.mode === 'dark' 
    ? 'rgba(255, 255, 255, 0.1)' 
    : 'rgba(0, 0, 0, 0.1)',
  boxShadow: theme.palette.mode === 'dark'
    ? '0 8px 32px rgba(0, 0, 0, 0.3)'
    : '0 8px 32px rgba(0, 0, 0, 0.1)',
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.palette.mode === 'dark'
      ? '0 12px 40px rgba(0, 0, 0, 0.4)'
      : '0 12px 40px rgba(0, 0, 0, 0.15)',
  },
}));

const StyledTypography = styled(Typography)(({ theme }) => ({
  fontSize: '1.1rem',
  lineHeight: 1.7,
  color: theme.palette.mode === 'dark' 
    ? theme.palette.text.primary 
    : theme.palette.text.primary,
  letterSpacing: '0.015em',
}));

const FeatureList = styled(Box)(({ theme }) => ({
  '& li': {
    marginBottom: theme.spacing(2),
    position: 'relative',
    paddingLeft: theme.spacing(2),
    '&::before': {
      content: '""',
      position: 'absolute',
      left: -theme.spacing(2),
      top: '0.7em',
      width: '6px',
      height: '6px',
      backgroundColor: theme.palette.primary.main,
      borderRadius: '50%',
    }
  }
}));

const ContactInfo = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
  '& .MuiTypography-root': {
    fontSize: '1.1rem',
    lineHeight: 1.7,
    color: theme.palette.mode === 'dark' 
      ? theme.palette.text.primary 
      : theme.palette.text.primary,
    transition: 'color 0.2s ease',
    '&:hover': {
      color: theme.palette.primary.main,
    }
  }
}));

function About() {
  return (
    <Container maxWidth="lg">
      <Box sx={{ 
        mt: { xs: 6, md: 8 }, 
        mb: { xs: 6, md: 8 },
        px: { xs: 2, md: 0 }
      }}>
        <GradientText 
          variant="h2" 
          component="h1" 
          gutterBottom 
          sx={{ 
            textAlign: 'center',
            mb: { xs: 4, md: 6 },
            fontSize: { xs: '2.5rem', md: '3.5rem' },
            letterSpacing: '-0.02em',
          }}
        >
          About AdaptiveTestAI
        </GradientText>

        <Grid container spacing={4}>
          <Grid item xs={12}>
            <SectionPaper elevation={0}>
              <GradientText variant="h4" gutterBottom sx={{ mb: 3 }}>
                Our Mission
              </GradientText>
              <StyledTypography>
                AdaptiveTestAI is revolutionizing education through AI-powered adaptive testing. Our platform dynamically adjusts question difficulty based on user performance, ensuring an optimized learning experience for each individual. We combine cutting-edge AI technology with proven educational methodologies to create a truly personalized assessment experience.
              </StyledTypography>
            </SectionPaper>
          </Grid>

          <Grid item xs={12} md={6}>
            <SectionPaper elevation={0}>
              <GradientText variant="h4" gutterBottom sx={{ mb: 3 }}>
                Key Features
              </GradientText>
              <FeatureList component="ul" sx={{ pl: 4, m: 0 }}>
                <li>
                  <StyledTypography>
                    <strong>Adaptive Question Selection:</strong> Questions are dynamically selected based on the user's performance level, ensuring appropriate challenge and learning progression.
                  </StyledTypography>
                </li>
                <li>
                  <StyledTypography>
                    <strong>Real-time Performance Analysis:</strong> Advanced algorithms analyze user responses to identify knowledge gaps and learning patterns.
                  </StyledTypography>
                </li>
                <li>
                  <StyledTypography>
                    <strong>AI-Powered Question Generation:</strong> Leveraging OpenAI's GPT models to generate high-quality, contextually relevant questions.
                  </StyledTypography>
                </li>
                <li>
                  <StyledTypography>
                    <strong>Comprehensive Analytics:</strong> Detailed insights into learning progress, knowledge gaps, and improvement areas.
                  </StyledTypography>
                </li>
              </FeatureList>
            </SectionPaper>
          </Grid>

          <Grid item xs={12} md={6}>
            <SectionPaper elevation={0}>
              <GradientText variant="h4" gutterBottom sx={{ mb: 3 }}>
                Technology Stack
              </GradientText>
              <FeatureList component="ul" sx={{ pl: 4, m: 0 }}>
                <li>
                  <StyledTypography>
                    <strong>Frontend:</strong> React.js with Material-UI and Vite for a modern, responsive interface
                  </StyledTypography>
                </li>
                <li>
                  <StyledTypography>
                    <strong>Backend:</strong> FastAPI (Python) for high-performance API development
                  </StyledTypography>
                </li>
                <li>
                  <StyledTypography>
                    <strong>Database:</strong> MongoDB Atlas for scalable data storage and management
                  </StyledTypography>
                </li>
                <li>
                  <StyledTypography>
                    <strong>AI Integration:</strong> OpenAI's GPT-3.5 Turbo for intelligent question generation
                  </StyledTypography>
                </li>
                <li>
                  <StyledTypography>
                    <strong>State Management:</strong> React Hooks for efficient component state management
                  </StyledTypography>
                </li>
              </FeatureList>
            </SectionPaper>
          </Grid>

          <Grid item xs={12}>
            <SectionPaper elevation={0}>
              <GradientText variant="h4" gutterBottom sx={{ mb: 3 }}>
                Contact Us
              </GradientText>
              <ContactInfo>
                <StyledTypography sx={{ 
                  fontSize: '1.2rem',
                  fontWeight: 500,
                  mb: 2 
                }}>
                  Have questions or feedback? We'd love to hear from you!
                </StyledTypography>
                <StyledTypography component="a" 
                  href="mailto:support@adaptivetestai.com"
                  sx={{ 
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    '&:hover': {
                      color: 'primary.main'
                    }
                  }}
                >
                  Email: support@adaptivetestai.com
                </StyledTypography>
                <StyledTypography component="a"
                  href="https://github.com/adaptivetestai"
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{ 
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    '&:hover': {
                      color: 'primary.main'
                    }
                  }}
                >
                  GitHub: github.com/adaptivetestai
                </StyledTypography>
              </ContactInfo>
            </SectionPaper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}

export default About; 