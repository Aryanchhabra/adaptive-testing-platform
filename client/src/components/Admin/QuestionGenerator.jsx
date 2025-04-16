import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Slider,
  TextField,
  Typography,
  Alert,
  CircularProgress,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Breadcrumbs,
  Link as MuiLink
} from '@mui/material';
import {
  Add as AddIcon,
  ExpandMore as ExpandMoreIcon,
  Check as CheckIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  Dashboard as DashboardIcon
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import AuthRedirect from '../auth/AuthRedirect';

const TOPICS = [
  'Python Basics',
  'Data Types',
  'Control Flow',
  'Functions',
  'Object-Oriented Programming',
  'Modules and Packages',
  'File Handling',
  'Exception Handling',
  'Regular Expressions',
  'Data Structures',
  'Algorithms',
  'Advanced Concepts'
];

const QuestionGenerator = () => {
  const [topic, setTopic] = useState('Python Basics');
  const [difficulty, setDifficulty] = useState(1);
  const [count, setCount] = useState(5);
  const [customTopic, setCustomTopic] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleTopicChange = (event) => {
    const value = event.target.value;
    setTopic(value);
  };

  const handleDifficultyChange = (event, newValue) => {
    setDifficulty(newValue);
  };

  const handleCountChange = (event, newValue) => {
    setCount(newValue);
  };

  const handleCustomTopicChange = (event) => {
    setCustomTopic(event.target.value);
  };

  const getDifficultyLabel = (value) => {
    return ['Beginner', 'Intermediate', 'Advanced'][value - 1];
  };

  const generateQuestions = async () => {
    try {
      setLoading(true);
      setError(null);
      setResult(null);

      const finalTopic = topic === 'Custom' ? customTopic : topic;

      const response = await fetch('/api/admin/generate-questions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topic: finalTopic,
          difficulty,
          count
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `Server error: ${response.status}`);
      }

      const data = await response.json();
      console.log("Received data:", data);

      if (!data || !data.questions) {
        throw new Error('Invalid response format from server');
      }

      setResult(data);
    } catch (err) {
      console.error('Error generating questions:', err);
      setError(err.message || 'Failed to generate questions');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AuthRedirect requireAdmin={true} />
      
      <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
        {/* Admin Panel Navigation */}
        <Box sx={{ mb: 4 }}>
          <Breadcrumbs separator="›" aria-label="admin-navigation">
            <MuiLink 
              component={Link} 
              to="/admin" 
              underline="hover" 
              sx={{ display: 'flex', alignItems: 'center' }}
              color="inherit"
            >
              <DashboardIcon sx={{ mr: 0.5 }} fontSize="small" />
              Admin Dashboard
            </MuiLink>
            <Typography color="text.primary" sx={{ fontWeight: 'medium' }}>
              Question Generator
            </Typography>
          </Breadcrumbs>
        </Box>

        <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
            AI Question Generator
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Generate Python programming questions using OpenAI. Questions will be stored in the database for use in quizzes.
          </Typography>

          <Divider sx={{ my: 3 }} />

          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Card variant="outlined" sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Generation Settings
                  </Typography>

                  <Box sx={{ mb: 3 }}>
                    <FormControl fullWidth sx={{ mb: 3 }}>
                      <InputLabel id="topic-label">Topic</InputLabel>
                      <Select
                        labelId="topic-label"
                        value={topic}
                        onChange={handleTopicChange}
                        label="Topic"
                      >
                        {TOPICS.map((t) => (
                          <MenuItem key={t} value={t}>
                            {t}
                          </MenuItem>
                        ))}
                        <MenuItem value="Custom">Custom Topic</MenuItem>
                      </Select>
                    </FormControl>

                    {topic === 'Custom' && (
                      <TextField
                        fullWidth
                        label="Custom Topic"
                        variant="outlined"
                        value={customTopic}
                        onChange={handleCustomTopicChange}
                        sx={{ mb: 3 }}
                        placeholder="e.g., Python List Comprehensions"
                      />
                    )}

                    <Box sx={{ mb: 3 }}>
                      <Typography gutterBottom>
                        Difficulty: {getDifficultyLabel(difficulty)}
                      </Typography>
                      <Slider
                        value={difficulty}
                        onChange={handleDifficultyChange}
                        step={1}
                        marks
                        min={1}
                        max={3}
                        valueLabelDisplay="auto"
                        valueLabelFormat={getDifficultyLabel}
                      />
                    </Box>

                    <Box sx={{ mb: 3 }}>
                      <Typography gutterBottom>
                        Number of Questions: {count}
                      </Typography>
                      <Slider
                        value={count}
                        onChange={handleCountChange}
                        step={1}
                        marks
                        min={1}
                        max={10}
                        valueLabelDisplay="auto"
                      />
                    </Box>

                    <Box sx={{ mt: 4 }}>
                      <Button
                        variant="contained"
                        color="primary"
                        size="large"
                        startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <AddIcon />}
                        onClick={generateQuestions}
                        disabled={loading || (topic === 'Custom' && !customTopic)}
                        fullWidth
                        sx={{ py: 1.5 }}
                      >
                        {loading ? 'Generating...' : 'Generate Questions'}
                      </Button>
                    </Box>
                  </Box>

                  <Box sx={{ mt: 3 }}>
                    <Typography variant="caption" color="text.secondary">
                      Note: Generation is limited to control API costs. Each question costs approximately $0.001-$0.002.
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card variant="outlined" sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Generation Results
                  </Typography>

                  {error && (
                    <Alert severity="error" sx={{ mb: 3 }}>
                      {error}
                    </Alert>
                  )}

                  {loading && (
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', my: 4 }}>
                      <CircularProgress size={60} thickness={4} />
                      <Typography sx={{ mt: 2 }}>
                        Generating questions... This may take up to 30 seconds.
                      </Typography>
                    </Box>
                  )}

                  {result && (
                    <Box>
                      <Alert severity="success" sx={{ mb: 3 }}>
                        {result.message || `Successfully generated ${result.questions.length} questions`}
                      </Alert>

                      <Box sx={{ mb: 2 }}>
                        <Chip
                          icon={<InfoIcon />}
                          label={`${result.questions.length} Questions Generated`}
                          color="primary"
                          variant="outlined"
                        />
                      </Box>

                      {result.questions.length > 0 ? (
                        <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
                          {result.questions.map((question, index) => (
                            <Accordion key={index} sx={{ mb: 1 }}>
                              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography>
                                  Question {index + 1}: {question.text.substring(0, 60)}
                                  {question.text.length > 60 ? '...' : ''}
                                </Typography>
                              </AccordionSummary>
                              <AccordionDetails>
                                <Typography variant="body2" paragraph>
                                  {question.text}
                                </Typography>
                                <List dense>
                                  {question.options.map((option, optIndex) => (
                                    <ListItem key={optIndex}>
                                      {optIndex === question.correctAnswer ? (
                                        <CheckIcon color="success" sx={{ mr: 1 }} />
                                      ) : (
                                        <Box sx={{ width: 24, mr: 1 }} />
                                      )}
                                      <ListItemText primary={option} />
                                    </ListItem>
                                  ))}
                                </List>
                                <Typography variant="body2" sx={{ mt: 2, fontWeight: 'bold' }}>
                                  Explanation:
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  {question.explanation}
                                </Typography>
                              </AccordionDetails>
                            </Accordion>
                          ))}
                        </Box>
                      ) : (
                        <Typography color="text.secondary">
                          No questions were generated. Please try again.
                        </Typography>
                      )}
                    </Box>
                  )}

                  {!loading && !error && !result && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
                      <Typography color="text.secondary">
                        Generated questions will appear here
                      </Typography>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </>
  );
};

export default QuestionGenerator; 