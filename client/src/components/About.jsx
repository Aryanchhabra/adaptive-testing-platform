import React from 'react';
import { Typography, Box, Container, Paper, Grid } from '@mui/material';

function About() {
  return (
    <Container maxWidth="lg">
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
          <span>About AdaptiveTestAI</span>
        </Typography>

        <Grid container spacing={4} sx={{ mt: 4 }}>
          <Grid item xs={12}>
            <Paper 
              elevation={0}
              sx={{ 
                p: 4,
                bgcolor: 'background.paper',
                borderRadius: 4,
                border: '1px solid',
                borderColor: 'rgba(255,255,255,0.1)',
              }}
            >
              <Typography variant="h5" gutterBottom color="primary">
                Our Mission
              </Typography>
              <Typography paragraph>
                AdaptiveTestAI is revolutionizing education through AI-powered adaptive testing. Our platform dynamically adjusts question difficulty based on user performance, ensuring an optimized learning experience for each individual.
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12}>
            <Paper 
              elevation={0}
              sx={{ 
                p: 4,
                bgcolor: 'background.paper',
                borderRadius: 4,
                border: '1px solid',
                borderColor: 'rgba(255,255,255,0.1)',
              }}
            >
              <Typography variant="h5" gutterBottom color="primary">
                Key Features
              </Typography>
              <Typography component="div">
                <Box component="ul" sx={{ pl: 2 }}>
                  <li>
                    <Typography paragraph>
                      <strong>Adaptive Question Selection:</strong> Questions are dynamically selected based on the user's performance level, ensuring appropriate challenge and learning progression.
                    </Typography>
                  </li>
                  <li>
                    <Typography paragraph>
                      <strong>Real-time Performance Analysis:</strong> Advanced algorithms analyze user responses to identify knowledge gaps and learning patterns.
                    </Typography>
                  </li>
                  <li>
                    <Typography paragraph>
                      <strong>Personalized Learning Path:</strong> AI-driven recommendations for study materials and practice questions tailored to individual needs.
                    </Typography>
                  </li>
                  <li>
                    <Typography paragraph>
                      <strong>Progress Tracking:</strong> Comprehensive analytics and progress reports to monitor learning journey and improvements.
                    </Typography>
                  </li>
                </Box>
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12}>
            <Paper 
              elevation={0}
              sx={{ 
                p: 4,
                bgcolor: 'background.paper',
                borderRadius: 4,
                border: '1px solid',
                borderColor: 'rgba(255,255,255,0.1)',
              }}
            >
              <Typography variant="h5" gutterBottom color="primary">
                Technology Stack
              </Typography>
              <Typography component="div">
                <Box component="ul" sx={{ pl: 2 }}>
                  <li>
                    <Typography paragraph>
                      <strong>Frontend:</strong> React.js with Material-UI for a modern, responsive interface
                    </Typography>
                  </li>
                  <li>
                    <Typography paragraph>
                      <strong>Backend:</strong> Python with Flask for robust API development
                    </Typography>
                  </li>
                  <li>
                    <Typography paragraph>
                      <strong>Authentication:</strong> Firebase Authentication for secure user management
                    </Typography>
                  </li>
                  <li>
                    <Typography paragraph>
                      <strong>Database:</strong> Firebase Firestore for real-time data storage
                    </Typography>
                  </li>
                  <li>
                    <Typography paragraph>
                      <strong>AI/ML:</strong> Advanced machine learning algorithms for adaptive testing and performance analysis
                    </Typography>
                  </li>
                </Box>
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}

export default About; 