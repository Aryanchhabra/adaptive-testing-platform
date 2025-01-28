import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import { LoginButton } from './Auth/LoginButton';

function Navbar() {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography 
          variant="h6" 
          component={Link} 
          to="/"
          sx={{ 
            flexGrow: 1, 
            textDecoration: 'none',
            color: 'inherit'
          }}
        >
          AdaptiveTestAI
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
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
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar; 