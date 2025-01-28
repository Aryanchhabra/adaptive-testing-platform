import React from 'react';
import { Typography, Box, Container, Paper, Grid } from '@mui/material';
import { Phone, Email, LocationOn } from '@mui/icons-material';

function Contact() {
  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 8 }}>
        <Typography 
          variant="h3" 
          component="h1" 
          gutterBottom 
          sx={{ 
            fontWeight: 700,
            textAlign: 'center',
            '& span': {
              background: 'linear-gradient(45deg, #2dd4bf, #38bdf8)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
            }
          }}
        >
          <span>Contact Us</span>
        </Typography>

        <Paper 
          elevation={0}
          sx={{ 
            p: 4,
            mt: 4,
            bgcolor: 'background.paper',
            borderRadius: 4,
            border: '1px solid',
            borderColor: 'rgba(255,255,255,0.1)',
          }}
        >
          <Typography variant="h5" gutterBottom color="primary" sx={{ mb: 4 }}>
            About AI Adventures
          </Typography>
          <Typography paragraph>
            AI Adventures is at the forefront of educational technology, developing innovative solutions that transform the way students learn and grow. Our flagship product, AdaptiveTestAI, represents our commitment to creating personalized learning experiences through artificial intelligence.
          </Typography>
          <Typography paragraph>
            We believe in making education more accessible, engaging, and effective through the power of adaptive learning technologies. Our team of experts combines educational expertise with cutting-edge AI to deliver solutions that make a real difference in students' learning journeys.
          </Typography>

          <Box sx={{ mt: 6 }}>
            <Typography variant="h6" gutterBottom color="primary">
              Get in Touch
            </Typography>
            <Grid container spacing={3} sx={{ mt: 2 }}>
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Phone color="primary" />
                  <Typography>
                    Call us on: +91 99216 68254
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Email color="primary" />
                  <Typography>
                    Email: support@aiadventures.com
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <LocationOn color="primary" />
                  <Typography>
                    Location: Pune, Maharashtra, India
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}

export default Contact; 