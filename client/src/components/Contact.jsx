import React from 'react';
import { Typography, Box, Container, Paper, Grid } from '@mui/material';
import { Phone, Email, LocationOn } from '@mui/icons-material';
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

const ContactItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
  padding: theme.spacing(2),
  borderRadius: theme.spacing(1),
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.08),
    transform: 'translateX(8px)',
  },
  '& .MuiSvgIcon-root': {
    color: theme.palette.primary.main,
    fontSize: '1.5rem',
  }
}));

function Contact() {
  return (
    <Container maxWidth="md">
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
          Contact Us
        </GradientText>

        <SectionPaper elevation={0}>
          <GradientText variant="h4" gutterBottom sx={{ mb: 3 }}>
            About AI Adventures
          </GradientText>
          <StyledTypography paragraph>
            AI Adventures is at the forefront of educational technology, developing innovative solutions that transform the way students learn and grow. Our flagship product, AdaptiveTestAI, represents our commitment to creating personalized learning experiences through artificial intelligence.
          </StyledTypography>
          <StyledTypography paragraph>
            We believe in making education more accessible, engaging, and effective through the power of adaptive learning technologies. Our team of experts combines educational expertise with cutting-edge AI to deliver solutions that make a real difference in students' learning journeys.
          </StyledTypography>

          <Box sx={{ mt: 6 }}>
            <GradientText variant="h4" gutterBottom sx={{ mb: 3 }}>
              Get in Touch
            </GradientText>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <ContactItem>
                  <Phone />
                  <StyledTypography>
                    Call us on: +91 99216 68254
                  </StyledTypography>
                </ContactItem>
              </Grid>
              <Grid item xs={12}>
                <ContactItem>
                  <Email />
                  <StyledTypography component="a" 
                    href="mailto:support@aiadventures.com"
                    sx={{ 
                      textDecoration: 'none',
                      '&:hover': {
                        color: 'primary.main'
                      }
                    }}
                  >
                    Email: support@aiadventures.com
                  </StyledTypography>
                </ContactItem>
              </Grid>
              <Grid item xs={12}>
                <ContactItem>
                  <LocationOn />
                  <StyledTypography>
                    Location: Pune, Maharashtra, India
                  </StyledTypography>
                </ContactItem>
              </Grid>
            </Grid>
          </Box>
        </SectionPaper>
      </Box>
    </Container>
  );
}

export default Contact; 