import React, { useState } from 'react';
import { 
  Box, Container, Typography, Button, 
  CircularProgress, Paper, Divider 
} from '@mui/material';
import QuestionFeedback from '../Quiz/QuestionFeedback';

function DemoFeatures() {
  const [loading, setLoading] = useState(false);
  const [demoData, setDemoData] = useState(null);
  const [error, setError] = useState(null);

  const runDemo = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:5000/api/demo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (!response.ok) throw new Error('Demo request failed');
      
      const data = await response.json();
      setDemoData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 8 }}>
        <Typography variant="h4" gutterBottom align="center">
          AI Features Demo
        </Typography>
        
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={runDemo}
          disabled={loading}
          sx={{ 
            display: 'block',
            margin: '2rem auto',
            minWidth: 200
          }}
        >
          {loading ? <CircularProgress size={24} /> : 'Run Demo'}
        </Button>

        {error && (
          <Typography color="error" align="center">
            Error: {error}
          </Typography>
        )}

        {demoData && (
          <Box sx={{ mt: 4 }}>
            {/* Sample Question */}
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Adaptive Question
              </Typography>
              <Typography>
                {demoData.question.text}
              </Typography>
              <Box sx={{ mt: 2 }}>
                {demoData.question.options.map((option, index) => (
                  <Typography key={index}>
                    {String.fromCharCode(65 + index)}. {option}
                  </Typography>
                ))}
              </Box>
            </Paper>

            {/* Progressive Hints */}
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Progressive Hints
              </Typography>
              {demoData.hints.map((hint, index) => (
                <Box key={index} sx={{ mb: 2 }}>
                  <Typography color="primary">
                    Hint {index + 1}:
                  </Typography>
                  <Typography>
                    {hint}
                  </Typography>
                </Box>
              ))}
            </Paper>

            {/* Learning Path */}
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Personalized Learning Path
              </Typography>
              <pre style={{ whiteSpace: 'pre-wrap' }}>
                {JSON.stringify(demoData.learning_path, null, 2)}
              </pre>
            </Paper>

            {/* Engagement Optimization */}
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Engagement Optimization
              </Typography>
              <pre style={{ whiteSpace: 'pre-wrap' }}>
                {JSON.stringify(demoData.engagement_optimization, null, 2)}
              </pre>
            </Paper>
          </Box>
        )}
      </Box>
    </Container>
  );
}

export default DemoFeatures; 