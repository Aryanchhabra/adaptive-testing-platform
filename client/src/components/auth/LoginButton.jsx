import React, { useState } from 'react';
import { Button, Menu, MenuItem, ListItemIcon, Avatar, Typography, Box } from '@mui/material';
import { Google, AdminPanelSettings, Logout, Person } from '@mui/icons-material';
import { useAuthContext } from '../../contexts/AuthContext';

export function LoginButton() {
  const [anchorEl, setAnchorEl] = useState(null);
  const { loginWithGoogle, user, logout } = useAuthContext();
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
      handleClose();
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const handleAdminLogin = () => {
    window.location.href = '/admin-login';
    handleClose();
  };

  const handleLogout = async () => {
    try {
      await logout();
      handleClose();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (user) {
    return (
      <>
        <Button
          color="inherit"
          onClick={handleClick}
          startIcon={
            user.photoURL ? (
              <Avatar 
                src={user.photoURL} 
                sx={{ width: 24, height: 24 }}
              />
            ) : (
              <Person />
            )
          }
          sx={{
            borderRadius: '8px',
            textTransform: 'none',
          }}
        >
          {user.displayName || user.email}
        </Button>
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          PaperProps={{
            sx: {
              mt: 1.5,
              backgroundColor: 'background.paper',
              border: '1px solid',
              borderColor: 'rgba(255,255,255,0.1)',
            }
          }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <MenuItem onClick={handleLogout}>
            <ListItemIcon>
              <Logout fontSize="small" />
            </ListItemIcon>
            Sign Out
          </MenuItem>
        </Menu>
      </>
    );
  }

  return (
    <>
      <Button
        color="inherit"
        onClick={handleClick}
        sx={{
          borderRadius: '8px',
        }}
      >
        Sign In
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: {
            mt: 1.5,
            backgroundColor: 'background.paper',
            border: '1px solid',
            borderColor: 'rgba(255,255,255,0.1)',
          }
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={handleGoogleLogin}>
          <ListItemIcon>
            <Google fontSize="small" />
          </ListItemIcon>
          Sign in with Google
        </MenuItem>
        <MenuItem onClick={handleAdminLogin}>
          <ListItemIcon>
            <AdminPanelSettings fontSize="small" />
          </ListItemIcon>
          Sign in as Admin
        </MenuItem>
      </Menu>
    </>
  );
} 