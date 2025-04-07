import React, { createContext, useContext } from 'react';
import { useAuth } from '../hooks/useAuth';

// Create the context and export it
export const AuthContext = createContext();

// Custom hook to use the auth context
export const useAuthContext = () => {
  return useContext(AuthContext);
};

// AuthProvider component
export const AuthProvider = ({ children }) => {
  const auth = useAuth();
  
  return (
    <AuthContext.Provider value={auth}>
      {/* Only render children when auth is not loading */}
      {!auth.loading && children}
    </AuthContext.Provider>
  );
}; 