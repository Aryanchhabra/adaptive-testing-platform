import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import { LoginButton } from './Auth/LoginButton';
import { useAuthContext } from '../contexts/AuthContext';

function Navbar() {
  const { user } = useAuthContext();

  return (
    <AppBar position="static">
      <Toolbar>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          flexGrow: 1,
          gap: 2
        }}>
          <img 
            src="/company-logo.png" 
            alt="Company Logo" 
            style={{ height: '40px' }}
          />
          <Typography 
            variant="h5" 
            component={Link} 
            to="/"
            sx={{ 
              textDecoration: 'none',
              color: 'inherit',
              fontWeight: 700,
              '& span': {
                background: 'linear-gradient(45deg, #2dd4bf, #38bdf8)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
              }
            }}
          >
            <span>AdaptiveTestAI</span>
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <Button color="inherit" component={Link} to="/">
            Home
          </Button>
          <Button color="inherit" component={Link} to="/about">
            About
          </Button>
          <Button color="inherit" component={Link} to="/contact">
            Contact
          </Button>
          <LoginButton />
          {!user && (
            <Button
              variant="contained"
              color="primary"
              component={Link}
              to="/signup"
              sx={{
                background: 'linear-gradient(45deg, #2dd4bf, #38bdf8)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #2dd4bf, #38bdf8)',
                  opacity: 0.9,
                }
              }}
            >
              Sign Up
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar; 