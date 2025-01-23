import { Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import Login from './components/auth/Login';
import Signup from './components/auth/Signup';
import Quiz from './components/quiz/Quiz';
import Analysis from './components/quiz/Analysis';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/quiz" element={<Quiz />} />
      <Route path="/analysis" element={<Analysis />} />
      {/* We'll add more routes later */}
    </Routes>
  );
};

export default App; 