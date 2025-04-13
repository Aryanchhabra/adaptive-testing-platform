import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthContext } from '../../contexts/AuthContext';
import { Box, CircularProgress, Typography } from '@mui/material';

const ProtectedRoute = ({ element, requireAdmin = false }) => {
  const { user, loading } = useAuthContext();
  const location = useLocation();
  const [checking, setChecking] = useState(true);
  
  useEffect(() => {
    // Once the auth state is loaded, we're done checking
    if (!loading) {
      setChecking(false);
    }
  }, [loading]);

  // Show loading indicator while checking auth status
  if (checking || loading) {
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

  // If admin route and user is not admin, redirect to login
  if (requireAdmin) {
    if (!user) {
      return <Navigate to="/admin-login" state={{ from: location }} replace />;
    }
    
    if (!user.isAdmin) {
      return <Navigate to="/admin-login" state={{ from: location }} replace />;
    }
  }

  // If user is not authenticated for a protected route
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If all checks pass, render the protected content
  return element;
};

export default ProtectedRoute; 