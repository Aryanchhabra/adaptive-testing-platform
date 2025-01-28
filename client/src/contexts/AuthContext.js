import React, { createContext, useContext } from 'react';
import { useAuth } from '../hooks/useAuth';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const auth = useAuth();
  
  return React.createElement(AuthContext.Provider, 
    { value: auth },
    !auth.loading && children
  );
};

export const useAuthContext = () => {
  return useContext(AuthContext);
}; 