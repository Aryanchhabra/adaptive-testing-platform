import React, { useState, useEffect } from 'react';
import { 
  Container, Paper, Typography, TextField, Button, Box, 
  Alert, CircularProgress, Snackbar
} from '@mui/material';
import { AdminPanelSettings } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../contexts/AuthContext';

function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showCredentials, setShowCredentials] = useState(false);
  
  const { login, user } = useAuthContext();
  const navigate = useNavigate();
  
  // Redirect if already logged in as admin
  useEffect(() => {
    if (user && user.isAdmin) {
      navigate('/admin');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const user = await login(email, password);
      
      if (user && user.isAdmin) {
        navigate('/admin');
      } else {
        setError('You do not have admin privileges');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Failed to login. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };
  
  const fillDemoCredentials = () => {
    setEmail('admin@adaptivetest.ai');
    setPassword('AdaptiveTest-Admin2024!');
    setShowCredentials(true);
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8 }}>
        <Paper 
          elevation={3} 
          sx={{ 
            p: 4,
            bgcolor: 'background.paper',
            borderRadius: 4,
          }}
        >
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <AdminPanelSettings sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
            <Typography variant="h4" gutterBottom>
              Admin Login
            </Typography>
            <Typography color="text.secondary">
              Please sign in with your administrator credentials
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Email"
              variant="outlined"
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <TextField
              fullWidth
              label="Password"
              type="password"
              variant="outlined"
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Button
              fullWidth
              type="submit"
              variant="contained"
              size="large"
              disabled={loading}
              sx={{
                mt: 3,
                background: 'linear-gradient(45deg, #0A66C2, #0b7ad4)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #085294, #0A66C2)',
                },
              }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
            </Button>
            
            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <Button 
                variant="text" 
                color="primary" 
                size="small"
                onClick={fillDemoCredentials}
              >
                Need demo credentials?
              </Button>
            </Box>
          </form>
        </Paper>
        
        {/* Help text for development */}
        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            For development purposes, use:
            <br />
            Email: admin@adaptivetest.ai
            <br />
            Password: AdaptiveTest-Admin2024!
          </Typography>
        </Box>
      </Box>
      
      <Snackbar
        open={showCredentials}
        autoHideDuration={6000}
        onClose={() => setShowCredentials(false)}
        message="Demo credentials filled in. Click Sign In to continue."
      />
    </Container>
  );
}

export default AdminLogin; 