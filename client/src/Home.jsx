import React from 'react';
import { Typography, Box } from '@mui/material';

function Home() {
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Welcome to AdaptiveTestAI
      </Typography>
      <Typography variant="body1" paragraph>
        An intelligent platform for adaptive testing and learning.
      </Typography>
    </Box>
  );
}

export default Home; 