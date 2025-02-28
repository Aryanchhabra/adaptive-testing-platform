import React from 'react';
import { Box, LinearProgress, Typography } from '@mui/material';
import { motion } from 'framer-motion';

const ProgressIndicator = ({ current, total }) => {
  const progress = (current / total) * 100;

  return (
    <Box sx={{ mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
        <Typography variant="body2" color="text.secondary">
          Question {current} of {total}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {Math.round(progress)}% Complete
        </Typography>
      </Box>
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.5 }}
      >
        <LinearProgress
          variant="determinate"
          value={progress}
          sx={{
            height: 8,
            borderRadius: 4,
            bgcolor: 'rgba(255,255,255,0.1)',
            '& .MuiLinearProgress-bar': {
              borderRadius: 4,
              background: 'linear-gradient(45deg, #0A66C2, #0b7ad4)',
            }
          }}
        />
      </motion.div>
    </Box>
  );
};

export default ProgressIndicator; 