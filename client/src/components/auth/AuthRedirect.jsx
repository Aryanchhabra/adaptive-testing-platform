import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Box, CircularProgress, Typography } from '@mui/material';
import { useAuthContext } from '../../contexts/AuthContext';

const AuthRedirect = ({ requireAdmin = false }) => {
  const { user, loading } = useAuthContext();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading) {
      // Only redirect once loading is complete
      if (requireAdmin) {
        if (!user) {
          navigate('/admin-login', { replace: true });
        } else if (!user.isAdmin) {
          navigate('/admin-login', { replace: true });
        }
      } else if (!user) {
        navigate('/login', { 
          replace: true,
          state: { from: location }
        });
      }
    }
  }, [user, loading, navigate, requireAdmin, location]);

  if (loading) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          flexDirection: 'column',
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '50vh' 
        }}
      >
        <CircularProgress />
        <Typography variant="body1" sx={{ mt: 2 }}>
          Checking authentication...
        </Typography>
      </Box>
    );
  }

  if ((requireAdmin && user?.isAdmin) || (!requireAdmin && user)) {
    return null; // Continue rendering the protected content
  }

  // Show loading while redirect happens
  return (
    <Box 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '50vh' 
      }}
    >
      <CircularProgress />
      <Typography variant="body1" sx={{ mt: 2 }}>
        Redirecting...
      </Typography>
    </Box>
  );
};

export default AuthRedirect; 