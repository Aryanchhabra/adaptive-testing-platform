import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import '../../styles/Auth.css';

const Login = () => {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement actual login logic
    console.log('Login attempt:', { ...formData, isAdmin });
    navigate(isAdmin ? '/admin/dashboard' : '/dashboard');
  };

  return (
    <div className="auth-container">
      <motion.div 
        className="auth-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Link to="/" className="auth-logo">
          <img src="/company-logo.png" alt="AdaptiveTestAI" className="logo-image" />
          <span className="gradient-text">AdaptiveTestAI</span>
        </Link>
        
        <h2>Welcome Back</h2>
        
        <div className="auth-type-toggle">
          <button 
            className={!isAdmin ? 'active' : ''} 
            onClick={() => setIsAdmin(false)}
          >
            Student
          </button>
          <button 
            className={isAdmin ? 'active' : ''} 
            onClick={() => setIsAdmin(true)}
          >
            Admin
          </button>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              required
            />
          </div>

          <button type="submit" className="auth-submit">
            Login
          </button>
        </form>

        <p className="auth-footer">
          Don't have an account? <Link to="/signup">Sign up</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login; 