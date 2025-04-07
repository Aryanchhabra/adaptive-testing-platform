import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box, IconButton, Menu, MenuItem, Tooltip } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { LoginButton } from './Auth/LoginButton';
import { useAuthContext } from '../contexts/AuthContext';
import { useTheme } from '@mui/material/styles';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';

function Navbar() {
  const { user, logout } = useAuthContext();
  const theme = useTheme();
  const navigate = useNavigate();
  const [adminMenuAnchor, setAdminMenuAnchor] = React.useState(null);

  const handleAdminMenuOpen = (event) => {
    setAdminMenuAnchor(event.currentTarget);
  };

  const handleAdminMenuClose = () => {
    setAdminMenuAnchor(null);
  };
  
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

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

          {/* Admin Menu */}
          {user && user.isAdmin && (
            <>
              <Tooltip title="Admin Panel">
                <IconButton 
                  color="inherit" 
                  onClick={handleAdminMenuOpen}
                  aria-label="Admin menu"
                  aria-controls="admin-menu"
                  aria-haspopup="true"
                  sx={{
                    bgcolor: 'rgba(255,255,255,0.1)',
                    '&:hover': {
                      bgcolor: 'rgba(255,255,255,0.2)',
                    }
                  }}
                >
                  <AdminPanelSettingsIcon />
                </IconButton>
              </Tooltip>
              <Menu
                id="admin-menu"
                anchorEl={adminMenuAnchor}
                keepMounted
                open={Boolean(adminMenuAnchor)}
                onClose={handleAdminMenuClose}
              >
                <MenuItem 
                  component={Link} 
                  to="/admin" 
                  onClick={handleAdminMenuClose}
                >
                  Admin Dashboard
                </MenuItem>
                <MenuItem 
                  component={Link} 
                  to="/admin/question-generator" 
                  onClick={handleAdminMenuClose}
                >
                  Generate Questions
                </MenuItem>
              </Menu>
            </>
          )}

          {user ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                {user.displayName || user.email}
              </Typography>
              <Button 
                variant="outlined" 
                color="inherit"
                size="small"
                onClick={handleLogout}
                sx={{ borderColor: 'rgba(255,255,255,0.3)' }}
              >
                Logout
              </Button>
            </Box>
          ) : (
            <>
              <Button
                variant="outlined" 
                color="inherit"
                component={Link}
                to="/admin-login"
                sx={{ borderColor: 'rgba(255,255,255,0.3)' }}
              >
                Admin Login
              </Button>
              
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
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar; 