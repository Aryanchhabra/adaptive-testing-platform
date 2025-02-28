import React from 'react';
import { Box, Container, Typography, Paper, Grid, Button } from '@mui/material';
import { motion } from 'framer-motion';
import { linkedinColors } from '../../theme';

const ResultSection = ({ title, content }) => (
  <Paper
    elevation={0}
    sx={{
      p: 4,
      background: `linear-gradient(135deg, 
        ${linkedinColors.paper} 0%, 
        rgba(10, 102, 194, 0.1) 100%)`,
      backdropFilter: 'blur(10px)',
      borderRadius: 4,
      border: '1px solid',
      borderColor: 'rgba(255,255,255,0.1)',
      mb: 3
    }}
  >
    <Typography variant="h6" gutterBottom>
      {title}
    </Typography>
    {content}
  </Paper>
);

function TestResults({ analysis, onRetake }) {
  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Typography variant="h4" gutterBottom>
            Test Analysis
          </Typography>
          
          <Grid container spacing={3}>
            {/* Performance Summary */}
            <Grid item xs={12}>
              <ResultSection
                title="Overall Performance"
                content={
                  <Typography>
                    {analysis.summary}
                  </Typography>
                }
              />
            </Grid>

            {/* Topic Breakdown */}
            <Grid item xs={12} md={6}>
              <ResultSection
                title="Strengths"
                content={
                  <ul>
                    {analysis.strengths.map((strength, index) => (
                      <li key={index}>{strength}</li>
                    ))}
                  </ul>
                }
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <ResultSection
                title="Areas for Improvement"
                content={
                  <ul>
                    {analysis.weaknesses.map((weakness, index) => (
                      <li key={index}>{weakness}</li>
                    ))}
                  </ul>
                }
              />
            </Grid>

            {/* Recommendations */}
            <Grid item xs={12}>
              <ResultSection
                title="Learning Recommendations"
                content={
                  <Box>
                    {analysis.recommendations.map((rec, index) => (
                      <Box key={index} sx={{ mb: 2 }}>
                        <Typography variant="subtitle1" gutterBottom>
                          {rec.topic}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {rec.details}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                }
              />
            </Grid>

            {/* Resources */}
            <Grid item xs={12}>
              <ResultSection
                title="Recommended Resources"
                content={
                  <Grid container spacing={2}>
                    {analysis.resources.map((resource, index) => (
                      <Grid item xs={12} md={4} key={index}>
                        <Paper
                          sx={{
                            p: 2,
                            bgcolor: 'background.paper',
                            '&:hover': {
                              borderColor: linkedinColors.primary,
                            }
                          }}
                        >
                          <Typography variant="subtitle2" gutterBottom>
                            {resource.title}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {resource.description}
                          </Typography>
                          <Button
                            href={resource.link}
                            target="_blank"
                            sx={{ mt: 1 }}
                          >
                            Learn More
                          </Button>
                        </Paper>
                      </Grid>
                    ))}
                  </Grid>
                }
              />
            </Grid>
          </Grid>

          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Button
              variant="contained"
              onClick={onRetake}
              sx={{
                background: `linear-gradient(45deg, 
                  ${linkedinColors.primary}, 
                  ${linkedinColors.light})`,
              }}
            >
              Take Another Test
            </Button>
          </Box>
        </motion.div>
      </Box>
    </Container>
  );
}

export default TestResults; 