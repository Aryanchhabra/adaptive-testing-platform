import React from 'react';
import { 
  Box, Typography, Paper, Grid, 
  Card, CardContent, Divider,
  Button, CircularProgress
} from '@mui/material';
import { motion } from 'framer-motion';
import {
  TrendingUp as ImprovementIcon,
  Stars as MasteryIcon,
  Timeline as ProgressIcon,
  Lightbulb as InsightIcon
} from '@mui/icons-material';

const QuizSummary = ({ knowledgeState, onRetakeQuiz }) => {
  // Calculate overall score
  const overallScore = Object.values(knowledgeState).reduce(
    (acc, curr) => acc + curr, 0
  ) / Object.values(knowledgeState).length * 100;

  // Identify strengths and areas for improvement
  const sortedTopics = Object.entries(knowledgeState).sort(
    ([,a], [,b]) => b - a
  );
  const strengths = sortedTopics.filter(([,score]) => score >= 0.7);
  const improvements = sortedTopics.filter(([,score]) => score < 0.7);

  const CircularProgressWithLabel = ({ value, label }) => (
    <Box sx={{ position: 'relative', display: 'inline-flex' }}>
      <CircularProgress
        variant="determinate"
        value={value}
        size={100}
        thickness={4}
        sx={{
          color: value >= 70 ? 'success.main' : value >= 40 ? 'warning.main' : 'error.main',
        }}
      />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: 'absolute',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography variant="h6" component="div" color="text.secondary">
          {`${Math.round(value)}%`}
        </Typography>
      </Box>
    </Box>
  );

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 1000, mx: 'auto', mt: 4 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Typography variant="h4" gutterBottom align="center" fontWeight="bold">
          Quiz Performance Analysis
        </Typography>

        {/* Overall Score */}
        <Box sx={{ textAlign: 'center', my: 4 }}>
          <CircularProgressWithLabel value={overallScore} />
          <Typography variant="h5" sx={{ mt: 2 }}>
            Overall Mastery
          </Typography>
        </Box>

        <Divider sx={{ my: 4 }} />

        {/* Detailed Analysis */}
        <Grid container spacing={4}>
          {/* Topic-wise Progress */}
          <Grid item xs={12} md={6}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <ProgressIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6">Topic-wise Progress</Typography>
                </Box>
                {Object.entries(knowledgeState).map(([topic, score]) => (
                  <Box key={topic} sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography>{topic}</Typography>
                      <Typography>{Math.round(score * 100)}%</Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={score * 100}
                      sx={{ 
                        height: 8, 
                        borderRadius: 4,
                        mt: 1,
                        bgcolor: 'rgba(0,0,0,0.1)',
                        '& .MuiLinearProgress-bar': {
                          borderRadius: 4,
                          background: 'linear-gradient(45deg, #0A66C2, #0b7ad4)',
                        }
                      }} 
                    />
                  </Box>
                ))}
              </CardContent>
            </Card>
          </Grid>

          {/* Strengths & Improvements */}
          <Grid item xs={12} md={6}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <MasteryIcon color="success" sx={{ mr: 1 }} />
                    <Typography variant="h6">Your Strengths</Typography>
                  </Box>
                  {strengths.length > 0 ? (
                    strengths.map(([topic]) => (
                      <Typography key={topic} color="success.main" sx={{ ml: 4 }}>
                        • {topic}
                      </Typography>
                    ))
                  ) : (
                    <Typography color="text.secondary" sx={{ ml: 4 }}>
                      Keep practicing to develop your strengths!
                    </Typography>
                  )}
                </Box>

                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <ImprovementIcon color="warning" sx={{ mr: 1 }} />
                    <Typography variant="h6">Areas for Improvement</Typography>
                  </Box>
                  {improvements.map(([topic]) => (
                    <Typography key={topic} color="warning.main" sx={{ ml: 4 }}>
                      • {topic}
                    </Typography>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Recommendations */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <InsightIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6">Personalized Recommendations</Typography>
                </Box>
                <Typography color="text.secondary" paragraph>
                  Based on your performance, we recommend focusing on:
                </Typography>
                <ul>
                  {improvements.map(([topic, score]) => (
                    <li key={topic}>
                      <Typography color="text.secondary">
                        <strong>{topic}:</strong> {score < 0.4 
                          ? "Review core concepts and practice basic examples" 
                          : "Practice intermediate problems and focus on edge cases"}
                      </Typography>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Button
            variant="contained"
            size="large"
            onClick={onRetakeQuiz}
            sx={{ px: 4, py: 1.5 }}
          >
            Retake Quiz
          </Button>
        </Box>
      </motion.div>
    </Paper>
  );
};

export default QuizSummary; 