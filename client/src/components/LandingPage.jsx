import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import '../styles/LandingPage.css';

const FeatureCard = ({ title, description, icon, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="feature-card"
  >
    <div className="feature-icon">{icon}</div>
    <h3>{title}</h3>
    <p>{description}</p>
  </motion.div>
);

const LandingPage = () => {
  return (
    <div className="landing-container">
      <nav className="navbar">
        <div className="logo">
          <img 
            src="/company-logo.png"
            alt="AdaptiveTestAI" 
            className="logo-image"
            style={{ width: '150px', height: '150px' }}
          />
          <span className="gradient-text">AdaptiveTestAI</span>
        </div>
        <div className="nav-links">
          <Link to="/quiz" className="nav-button highlight">Start Quiz</Link>
          <Link to="/login" className="nav-button">Login</Link>
          <Link to="/signup" className="nav-button primary">Sign Up</Link>
        </div>
      </nav>

      <main>
        <section className="hero">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="hero-title"
          >
            Personalized Learning, <span className="gradient-text">Evolved</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="hero-subtitle"
          >
            Experience adaptive learning that evolves with your progress
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="hero-actions"
          >
            <Link to="/quiz" className="hero-button primary">
              Take a Quiz Now
            </Link>
          </motion.div>
        </section>

        <section className="features">
          <FeatureCard
            title="AI-Powered Questions"
            description="Dynamic question generation using advanced AI for unique learning experiences"
            icon="🤖"
            delay={0.3}
          />
          <FeatureCard
            title="Adaptive Testing"
            description="Questions that adjust in real-time based on your performance"
            icon="📈"
            delay={0.4}
          />
          <FeatureCard
            title="Performance Analytics"
            description="Detailed insights into your learning progress and strengths"
            icon="📊"
            delay={0.5}
          />
          <FeatureCard
            title="Smart Recommendations"
            description="Personalized learning paths based on your performance"
            icon="🎯"
            delay={0.6}
          />
        </section>
      </main>
    </div>
  );
};

export default LandingPage; 