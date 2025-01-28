import React, { useState } from 'react';
import { Container, Paper, Typography, Box, Button, Divider } from '@mui/material';
import { Google } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../contexts/AuthContext';

function Signup() {
  const navigate = useNavigate();
  const { loginWithGoogle, user } = useAuthContext();

  // Redirect if user is already logged in
  React.useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleGoogleSignup = async () => {
    try {
      await loginWithGoogle();
      navigate('/');
    } catch (error) {
      console.error('Signup failed:', error);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8 }}>
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
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography variant="h4" gutterBottom>
              Create Your Account
            </Typography>
            <Typography color="text.secondary">
              Join AdaptiveTestAI and start your learning journey
            </Typography>
          </Box>

          <Button
            fullWidth
            variant="contained"
            size="large"
            startIcon={<Google />}
            onClick={handleGoogleSignup}
            sx={{
              mb: 2,
              background: 'linear-gradient(45deg, #2dd4bf, #38bdf8)',
              '&:hover': {
                background: 'linear-gradient(45deg, #2dd4bf, #38bdf8)',
                opacity: 0.9,
              }
            }}
          >
            Sign up with Google
          </Button>

          <Box sx={{ my: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
            <Divider sx={{ flex: 1 }} />
            <Typography color="text.secondary" variant="body2">
              By signing up, you agree to our Terms and Privacy Policy
            </Typography>
            <Divider sx={{ flex: 1 }} />
          </Box>

          <Typography color="text.secondary" variant="body2" align="center">
            Already have an account?{' '}
            <Button
              color="primary"
              onClick={() => navigate('/')}
              sx={{ textTransform: 'none' }}
            >
              Sign in
            </Button>
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
}

export default Signup; 