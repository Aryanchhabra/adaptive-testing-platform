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

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // Check if user is admin
        const isAdmin = ADMIN_USERS.some(admin => admin.email === user.email);
        setUser({
          ...user,
          isAdmin
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signup = async (email, password) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error) {
      throw error;
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
          uid: `admin-${Date.now()}`,
          displayName: 'Admin User',
          isAdmin: true
        };
        
        // Set the user in our state
        setUser(mockAdminUser);
        return mockAdminUser;
      }
      
      // If not admin, proceed with normal Firebase auth
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error) {
      throw error;
    }
  };

  const loginWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      
      // Check if Google user is an admin
      const isAdmin = ADMIN_USERS.some(admin => admin.email === result.user.email);
      
      if (isAdmin) {
        setUser({
          ...result.user,
          isAdmin: true
        });
      }
      
      return result.user;
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      throw error;
    }
  };

  return {
    user,
    loading,
    signup,
    login,
    loginWithGoogle,
    logout
  };
}; 