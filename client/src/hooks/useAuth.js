import { useState, useEffect } from 'react';
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { auth } from '../firebase/config';

// Admin users for development - would be stored in database in production
const ADMIN_USERS = [
  { email: 'admin@adaptivetest.ai', password: 'AdaptiveTest-Admin2024!' }
];

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('authToken'));

  useEffect(() => {
    const checkTokenAndFirebase = async () => {
      try {
        setLoading(true);
        // Check if the user was an admin from a previous session
        const adminEmail = localStorage.getItem('adminEmail');
        if (adminEmail === 'admin@adaptivetest.ai') {
          // Recreate the admin user object
          const mockAdminUser = {
            email: adminEmail,
            id: `admin-${Date.now()}`,
            displayName: 'Admin User',
            isAdmin: true
          };
          setUser(mockAdminUser);
          setLoading(false);
          return;
        }
        
        // If we have a token, fetch the user from our backend
        if (token) {
          try {
            const response = await fetch('/api/auth/me', {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            });
            
            if (response.ok) {
              const userData = await response.json();
              setUser(userData);
              setLoading(false);
              return;
            } else {
              // Token invalid, remove it
              console.log("Invalid token, removing...");
              localStorage.removeItem('authToken');
              setToken(null);
            }
          } catch (error) {
            console.error("Error checking token:", error);
            localStorage.removeItem('authToken');
            setToken(null);
          }
        }
        
        // Fall back to Firebase auth if no token or token invalid
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
          if (firebaseUser) {
            // Check if user is admin
            const isAdmin = ADMIN_USERS.some(admin => admin.email === firebaseUser.email);
            
            // Check if this Firebase user exists in our backend
            try {
              // Get Firebase ID token
              const idToken = await firebaseUser.getIdToken();
              
              // Try to authenticate with backend using Google token
              const response = await fetch('/api/auth/google', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token: idToken })
              });
              
              if (response.ok) {
                const data = await response.json();
                localStorage.setItem('authToken', data.access_token);
                setToken(data.access_token);
                setUser(data.user);
              } else {
                // Default to Firebase user if backend auth fails
                setUser({
                  ...firebaseUser,
                  isAdmin
                });
              }
            } catch (error) {
              console.error("Error connecting to backend:", error);
              // Default to Firebase user
              setUser({
                ...firebaseUser,
                isAdmin
              });
            }
          } else {
            setUser(null);
          }
          setLoading(false);
        });
        
        return unsubscribe;
      } catch (error) {
        console.error("Auth initialization error:", error);
        setLoading(false);
        setUser(null);
      }
    };
    
    checkTokenAndFirebase();
  }, [token]);

  const signup = async (email, password, displayName) => {
    try {
      // First try to register with our backend
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email, 
          password, 
          display_name: displayName 
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Registration failed');
      }
      
      const data = await response.json();
      localStorage.setItem('authToken', data.access_token);
      setToken(data.access_token);
      setUser(data.user);
      return data.user;
    } catch (backendError) {
      console.error("Backend signup failed, falling back to Firebase:", backendError);
      
      // Fall back to Firebase if backend fails
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        if (displayName) {
          await userCredential.user.updateProfile({ displayName });
        }
        return userCredential.user;
      } catch (firebaseError) {
        console.error("Firebase signup also failed:", firebaseError);
        throw firebaseError;
      }
    }
  };

  const login = async (email, password) => {
    try {
      // First check if it's an admin user (for development purposes)
      const adminUser = ADMIN_USERS.find(admin => 
        admin.email === email && admin.password === password
      );
      
      if (adminUser) {
        // Create a mock admin user object
        const mockAdminUser = {
          email,
          id: `admin-${Date.now()}`,
          displayName: 'Admin User',
          isAdmin: true
        };
        
        // Save admin email for persistence
        localStorage.setItem('adminEmail', email);
        
        // Set the user in our state
        setUser(mockAdminUser);
        return mockAdminUser;
      }
      
      // Try to login with our backend
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Login failed');
      }
      
      const data = await response.json();
      localStorage.setItem('authToken', data.access_token);
      setToken(data.access_token);
      setUser(data.user);
      return data.user;
    } catch (backendError) {
      console.error("Backend login failed, falling back to Firebase:", backendError);
      
      // Fall back to Firebase if backend fails
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return userCredential.user;
      } catch (firebaseError) {
        console.error("Firebase login also failed:", firebaseError);
        throw firebaseError;
      }
    }
  };

  const loginWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      
      // Get ID token from Firebase
      const idToken = await result.user.getIdToken();
      
      // Try to authenticate with our backend
      try {
        const response = await fetch('/api/auth/google', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token: idToken })
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          console.warn("Backend Google auth failed:", errorData);
          // Continue with Firebase user if backend fails
        } else {
          const data = await response.json();
          localStorage.setItem('authToken', data.access_token);
          setToken(data.access_token);
          setUser(data.user);
          return data.user;
        }
      } catch (backendError) {
        console.error("Error connecting to backend for Google auth:", backendError);
        // Continue with Firebase user if backend fails
      }
      
      // Check if Google user is an admin
      const isAdmin = ADMIN_USERS.some(admin => admin.email === result.user.email);
      
      if (isAdmin) {
        setUser({
          ...result.user,
          isAdmin: true
        });
      } else {
        setUser(result.user);
      }
      
      return result.user;
    } catch (error) {
      console.error("Google login failed:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      // Clear backend token
      localStorage.removeItem('authToken');
      setToken(null);
      
      // Also sign out from Firebase
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
  };

  return {
    user,
    loading,
    token,
    signup,
    login,
    loginWithGoogle,
    logout,
    isAuthenticated: !!user
  };
}; 