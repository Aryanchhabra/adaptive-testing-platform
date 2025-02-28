import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import { LoginButton } from './Auth/LoginButton';
import { useAuthContext } from '../contexts/AuthContext';
import { useTheme } from '@mui/material/styles';

function Navbar() {
  const { user } = useAuthContext();
  const theme = useTheme();

  const navItems = [
    { text: 'Home', path: '/' },
    { text: 'About', path: '/about' },
    { text: 'Contact', path: '/contact' }
  ];

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
                background: (theme) => 
                  `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
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
          {navItems.map((item, index) => (
            <Button key={index} color="inherit" component={Link} to={item.path}>
              {item.text}
            </Button>
          ))}

          <LoginButton />
          
          {!user && (
            <Button
              variant="contained"
              color="primary"
              component={Link}
              to="/signup"
              sx={{
                background: 'linear-gradient(45deg, #0A66C2, #0b7ad4)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #084b8e, #0A66C2)',
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