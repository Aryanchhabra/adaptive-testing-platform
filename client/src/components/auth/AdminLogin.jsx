import React, { useState } from 'react';
import { Container, Paper, Typography, TextField, Button, Box } from '@mui/material';
import { AdminPanelSettings } from '@mui/icons-material';

function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add your admin authentication logic here
    console.log('Admin login attempt:', { email, password });
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
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <AdminPanelSettings sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
            <Typography variant="h4" gutterBottom>
              Admin Login
            </Typography>
            <Typography color="text.secondary">
              Please sign in with your administrator credentials
            </Typography>
          </Box>

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
              sx={{
                mt: 3,
                background: 'linear-gradient(45deg, #2dd4bf, #38bdf8)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #2dd4bf, #38bdf8)',
                  opacity: 0.9,
                }
              }}
            >
              Sign In
            </Button>
          </form>
        </Paper>
      </Box>
    </Container>
  );
}

export default AdminLogin; 