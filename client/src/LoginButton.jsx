import React from 'react';
import { Button } from '@mui/material';
import { useAuthContext } from '../../contexts/AuthContext';

export function LoginButton() {
  const { loginWithGoogle } = useAuthContext();

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <Button
      variant="contained"
      color="secondary"
      onClick={handleGoogleLogin}
      sx={{ textTransform: 'none' }}
    >
      Sign in with Google
    </Button>
  );
} 