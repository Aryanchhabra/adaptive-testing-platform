import React from 'react';
import { 
  Box, Typography, Paper, Container, 
  Grid, LinearProgress, Chip 
} from '@mui/material';
import { 
  Timeline, TimelineItem, TimelineContent,
  TimelineSeparator, TimelineDot 
} from '@mui/lab';

function QuizResults({ results }) {
  const { statistics, analysis, recommendations } = results;

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Quiz Results
        </Typography>
        
        <Grid container spacing={3}>
          {/* Performance Statistics */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Performance Overview
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Accuracy
                </Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={statistics.accuracy * 100} 
                  sx={{ mt: 1 }}
                />
                <Typography variant="h4" sx={{ mt: 1 }}>
                  {Math.round(statistics.accuracy * 100)}%
                </Typography>
              </Box>
              {/* Add more statistics */}
            </Paper>
          </Grid>

          {/* AI Analysis */}
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                AI Analysis
              </Typography>
              <Timeline>
                {analysis.strengths.map((strength, index) => (
                  <TimelineItem key={index}>
                    <TimelineSeparator>
                      <TimelineDot color="success" />
                    </TimelineSeparator>
                    <TimelineContent>
                      <Typography variant="body1">
                        {strength}
                      </Typography>
                    </TimelineContent>
                  </TimelineItem>
                ))}
              </Timeline>
            </Paper>
          </Grid>

          {/* Recommendations */}
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Personalized Recommendations
              </Typography>
              <Grid container spacing={2}>
                {recommendations.topics.map((topic, index) => (
                  <Grid item key={index}>
                    <Chip 
                      label={topic} 
                      color="primary" 
                      variant="outlined" 
                    />
                  </Grid>
                ))}
              </Grid>
              {/* Add more recommendations */}
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}

export default QuizResults; 