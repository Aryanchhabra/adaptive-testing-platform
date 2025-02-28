import React, { useState } from 'react';
import axios from 'axios';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
  Snackbar,
  List,
  ListItem,
  ListItemText,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const API_URL = 'http://localhost:5000/api';

const QuestionGenerator = () => {
  const [topic, setTopic] = useState('Basic Python Syntax');
  const [difficulty, setDifficulty] = useState(1);
  const [count, setCount] = useState(5);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const topics = [
    'Basic Python Syntax',
    'Data Types and Variables',
    'Control Flow',
    'Functions',
    'Lists and Dictionaries',
    'Object-Oriented Programming',
    'File Handling',
    'Error Handling',
    'Modules and Packages'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    
    try {
      const response = await axios.post(`${API_URL}/admin/generate-questions`, {
        topic,
        difficulty,
        count: parseInt(count)
      });
      
      setResult(response.data);
      setSnackbarOpen(true);
    } catch (err) {
      console.error('Error generating questions:', err);
      setError(err.response?.data?.message || err.message || 'Failed to generate questions');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', mt: 4, mb: 8, px: 2 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          AI Question Generator
        </Typography>
        
        <Typography variant="body1" sx={{ mb: 3 }}>
          Generate AI-powered questions for your adaptive testing platform.
        </Typography>
        
        <form onSubmit={handleSubmit}>
          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel>Topic</InputLabel>
            <Select
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              label="Topic"
            >
              {topics.map((t) => (
                <MenuItem key={t} value={t}>{t}</MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel>Difficulty</InputLabel>
            <Select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              label="Difficulty"
            >
              <MenuItem value={1}>Beginner</MenuItem>
              <MenuItem value={2}>Intermediate</MenuItem>
              <MenuItem value={3}>Advanced</MenuItem>
            </Select>
          </FormControl>
          
          <TextField
            fullWidth
            label="Number of Questions"
            type="number"
            value={count}
            onChange={(e) => setCount(e.target.value)}
            InputProps={{ inputProps: { min: 1, max: 20 } }}
            sx={{ mb: 3 }}
          />
          
          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="large"
            disabled={loading}
            sx={{ minWidth: 150 }}
          >
            {loading ? <CircularProgress size={24} /> : 'Generate Questions'}
          </Button>
        </form>
        
        {error && (
          <Alert severity="error" sx={{ mt: 3 }}>
            {error}
          </Alert>
        )}
        
        {result && (
          <Box sx={{ mt: 4 }}>
            <Alert severity="success" sx={{ mb: 3 }}>
              Successfully generated {result.questions.length} questions!
            </Alert>
            
            <Typography variant="h6" gutterBottom>
              Generated Questions:
            </Typography>
            
            {result.questions.map((question, index) => (
              <Accordion key={index} sx={{ mb: 2 }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography>
                    Question {index + 1}: {question.text.substring(0, 60)}...
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography variant="body1" gutterBottom>
                    {question.text}
                  </Typography>
                  
                  <List>
                    {question.options.map((option, optIndex) => (
                      <ListItem key={optIndex} sx={{
                        bgcolor: optIndex === question.correct_answer ? 'rgba(76, 175, 80, 0.1)' : 'transparent',
                        borderLeft: optIndex === question.correct_answer ? '3px solid #4caf50' : 'none',
                        pl: optIndex === question.correct_answer ? 2 : 1
                      }}>
                        <ListItemText 
                          primary={`${String.fromCharCode(65 + optIndex)}. ${option}`} 
                        />
                      </ListItem>
                    ))}
                  </List>
                  
                  <Typography variant="subtitle1" sx={{ mt: 2, fontWeight: 'bold' }}>
                    Explanation:
                  </Typography>
                  <Typography variant="body2">
                    {question.explanation}
                  </Typography>
                </AccordionDetails>
              </Accordion>
            ))}
          </Box>
        )}
      </Paper>
      
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        message="Questions generated and added to database"
      />
    </Box>
  );
};

export default QuestionGenerator; 