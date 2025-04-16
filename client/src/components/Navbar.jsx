import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box, IconButton, Menu, MenuItem, Tooltip, Avatar } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { LoginButton } from './auth/LoginButton';
import { useAuthContext } from '../contexts/AuthContext';
import { useTheme } from '@mui/material/styles';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import PersonIcon from '@mui/icons-material/Person';

function Navbar() {
  const { user, logout } = useAuthContext();
  const theme = useTheme();
  const navigate = useNavigate();
  const [adminMenuAnchor, setAdminMenuAnchor] = React.useState(null);
  const [userMenuAnchor, setUserMenuAnchor] = React.useState(null);

  const handleAdminMenuOpen = (event) => {
    setAdminMenuAnchor(event.currentTarget);
  };

  const handleAdminMenuClose = () => {
    setAdminMenuAnchor(null);
  };
  
  const handleUserMenuOpen = (event) => {
    setUserMenuAnchor(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserMenuAnchor(null);
  };
  
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
      handleUserMenuClose();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleProfileClick = () => {
    navigate('/profile');
    handleUserMenuClose();
  };

  const navItems = [
    { text: 'Home', path: '/' },
    { text: 'About', path: '/about' },
    { text: 'Contact', path: '/contact' }
  ];

  return (
    <AppBar
      position="static"
      color="transparent"
      elevation={0}
      sx={{
        borderBottom: '1px solid',
        borderColor: 'divider',
        bgcolor: 'background.paper'
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <img 
            src="/company-logo.png" 
            alt="Company Logo" 
            style={{ height: '40px', marginRight: '10px' }}
          />
          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{
              textDecoration: 'none',
              color: 'inherit',
              fontWeight: 700,
              '& span': {
                background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
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

          {/* User Menu */}
          {user ? (
            <>
              <Tooltip title="User Menu">
                <IconButton
                  onClick={handleUserMenuOpen}
                  aria-label="User menu"
                  aria-controls="user-menu"
                  aria-haspopup="true"
                  sx={{
                    p: 0.5
                  }}
                >
                  {user.photoURL ? (
                    <Avatar 
                      src={user.photoURL} 
                      alt={user.displayName || user.email}
                      sx={{ width: 40, height: 40 }}
                    />
                  ) : (
                    <Avatar sx={{ width: 40, height: 40, bgcolor: theme.palette.primary.main }}>
                      {(user.displayName || user.email || '?').charAt(0).toUpperCase()}
                    </Avatar>
                  )}
                </IconButton>
              </Tooltip>
              <Menu
                id="user-menu"
                anchorEl={userMenuAnchor}
                keepMounted
                open={Boolean(userMenuAnchor)}
                onClose={handleUserMenuClose}
              >
                <MenuItem onClick={handleProfileClick}>
                  <PersonIcon fontSize="small" sx={{ mr: 1 }} />
                  My Profile
                </MenuItem>
                <MenuItem onClick={handleLogout}>
                  Logout
                </MenuItem>
              </Menu>
            </>
          ) : (
            <>
              <Button
                variant="outlined" 
                color="inherit"
                component={Link}
                to="/login"
                sx={{ borderColor: 'rgba(0,0,0,0.12)' }}
              >
                Login
              </Button>
              
              <Button
                variant="contained"
                color="primary"
                component={Link}
                to="/signup"
                sx={{
                  background: 'linear-gradient(45deg, #3a86ff, #4361ee)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #3a86ff, #4361ee)',
                    opacity: 0.9,
                  }
                }}
              >
                Sign Up
              </Button>
              
              <Button
                variant="outlined"
                color="secondary"
                component={Link}
                to="/admin-login"
                startIcon={<AdminPanelSettingsIcon />}
                sx={{ 
                  ml: 1,
                  borderColor: 'rgba(156, 39, 176, 0.5)',
                  color: 'secondary.main' 
                }}
              >
                Admin
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar; 