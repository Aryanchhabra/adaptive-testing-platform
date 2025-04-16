import React, { useState, useEffect } from 'react';
import {
  Container, Typography, Box, Paper, Tabs, Tab, 
  Button, TextField, Dialog, DialogTitle, DialogContent,
  DialogActions, List, ListItem, ListItemText, IconButton,
  Divider, Chip, FormControl, InputLabel, Select, MenuItem,
  Grid, Card, CardContent, CardActions, CircularProgress,
  Snackbar, Alert, Tooltip, TableCell, TableRow
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  ExpandMore as ExpandMoreIcon,
  Save as SaveIcon,
  Refresh as RefreshIcon,
  Preview as PreviewIcon,
  Code as CodeIcon
} from '@mui/icons-material';
import AuthRedirect from '../auth/AuthRedirect';
import { useAuthContext } from '../../contexts/AuthContext';

const QuizManagement = () => {
  // Get auth context to display user info
  const { user, loading: authLoading } = useAuthContext();
  
  // Tab state
  const [tabValue, setTabValue] = useState(0);
  
  // Data states
  const [topics, setTopics] = useState([
    { id: 'basic-syntax', name: 'Basic Python Syntax', questionCount: 15 },
    { id: 'data-types', name: 'Data Types', questionCount: 12 },
    { id: 'control-flow', name: 'Control Flow', questionCount: 10 },
    { id: 'functions', name: 'Functions', questionCount: 8 },
    { id: 'oop', name: 'Object-Oriented Programming', questionCount: 7 }
  ]);
  
  const [questions, setQuestions] = useState([
    { 
      id: 'q1', 
      topic: 'Basic Python Syntax', 
      difficulty: 'Easy', 
      content: 'What is the correct syntax to print "Hello, World!" in Python?',
      options: [
        'echo "Hello, World!"',
        'print("Hello, World!")',
        'console.log("Hello, World!")',
        'System.out.println("Hello, World!")'
      ],
      correctAnswer: 'print("Hello, World!")'
    },
    { 
      id: 'q2', 
      topic: 'Data Types', 
      difficulty: 'Medium', 
      content: 'Which of the following is not a mutable data type in Python?',
      options: [
        'List',
        'Dictionary',
        'Tuple',
        'Set'
      ],
      correctAnswer: 'Tuple'
    },
    { 
      id: 'q3', 
      topic: 'Control Flow', 
      difficulty: 'Medium', 
      content: 'What does the following code print?\n\nfor i in range(3, 8, 2):\n    print(i)',
      options: [
        '3 4 5 6 7',
        '3 5 7',
        '3 5 7 9',
        '4 6 8'
      ],
      correctAnswer: '3 5 7'
    }
  ]);
  
  // UI states
  const [dataLoading, setDataLoading] = useState(false);
  const [openTopicDialog, setOpenTopicDialog] = useState(false);
  const [openQuestionDialog, setOpenQuestionDialog] = useState(false);
  const [newTopic, setNewTopic] = useState({ name: '' });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [newQuestion, setNewQuestion] = useState({
    topic: '',
    difficulty: 'Medium',
    content: '',
    options: ['', '', '', ''],
    correctAnswer: ''
  });
  
  // State for the new question dialog
  const [currentQuestion, setCurrentQuestion] = useState({
    id: null,
    question: '',
    code: '',
    topic: '',
    difficulty: 'medium',
    options: ['', '', '', ''],
    correctOptionIndex: 0,
    explanation: ''
  });
  
  // State for search and filter
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState({
    topic: 'all',
    difficulty: 'all'
  });
  
  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  // Topic dialog handlers
  const handleOpenTopicDialog = () => {
    setNewTopic({ name: '' });
    setOpenTopicDialog(true);
  };
  
  const handleCloseTopicDialog = () => {
    setOpenTopicDialog(false);
  };
  
  const handleSaveTopic = () => {
    if (newTopic.name.trim() === '') {
      setSnackbar({
        open: true,
        message: 'Topic name cannot be empty',
        severity: 'error'
      });
      return;
    }
    
    // Add new topic
    const newId = `topic-${Date.now()}`;
    setTopics([...topics, { 
      id: newId, 
      name: newTopic.name,
      questionCount: 0
    }]);
    
    // Show success message
    setSnackbar({
      open: true,
      message: 'Topic added successfully!',
      severity: 'success'
    });
    
    // Close dialog
    setOpenTopicDialog(false);
  };
  
  // Question dialog handlers
  const handleOpenQuestionDialog = () => {
    setNewQuestion({
      topic: topics[0]?.name || '',
      difficulty: 'Medium',
      content: '',
      options: ['', '', '', ''],
      correctAnswer: ''
    });
    setOpenQuestionDialog(true);
  };
  
  const handleCloseQuestionDialog = () => {
    setOpenQuestionDialog(false);
  };
  
  const handleOptionChange = (index, value) => {
    const updatedOptions = [...newQuestion.options];
    updatedOptions[index] = value;
    setNewQuestion({
      ...newQuestion,
      options: updatedOptions
    });
  };
  
  const handleSaveQuestion = () => {
    // Validate form
    if (
      newQuestion.content.trim() === '' ||
      newQuestion.options.some(option => option.trim() === '') ||
      newQuestion.correctAnswer.trim() === ''
    ) {
      setSnackbar({
        open: true,
        message: 'Please fill in all fields',
        severity: 'error'
      });
      return;
    }
    
    // Add new question
    const newId = `question-${Date.now()}`;
    setQuestions([...questions, { 
      id: newId,
      ...newQuestion 
    }]);
    
    // Update question count for the selected topic
    setTopics(topics.map(topic => 
      topic.name === newQuestion.topic 
        ? { ...topic, questionCount: topic.questionCount + 1 }
        : topic
    ));
    
    // Show success message
    setSnackbar({
      open: true,
      message: 'Question added successfully!',
      severity: 'success'
    });
    
    // Close dialog
    setOpenQuestionDialog(false);
  };
  
  // Delete handlers
  const handleDeleteTopic = (topicId) => {
    const topicToDelete = topics.find(t => t.id === topicId);
    
    // Check if topic has questions
    const hasQuestions = questions.some(q => q.topic === topicToDelete.name);
    if (hasQuestions) {
      setSnackbar({
        open: true,
        message: 'Cannot delete topic with questions. Remove questions first.',
        severity: 'error'
      });
      return;
    }
    
    // Delete topic
    setTopics(topics.filter(topic => topic.id !== topicId));
    
    setSnackbar({
      open: true,
      message: 'Topic deleted successfully!',
      severity: 'success'
    });
  };
  
  const handleDeleteQuestion = (questionId) => {
    const questionToDelete = questions.find(q => q.id === questionId);
    
    // Delete question
    setQuestions(questions.filter(question => question.id !== questionId));
    
    // Update question count for the related topic
    setTopics(topics.map(topic => 
      topic.name === questionToDelete.topic 
        ? { ...topic, questionCount: topic.questionCount - 1 }
        : topic
    ));
    
    setSnackbar({
      open: true,
      message: 'Question deleted successfully!',
      severity: 'success'
    });
  };
  
  // Snackbar close handler
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };
  
  // Handlers for the new question dialog
  const handleOpenDialog = (question = null) => {
    if (question) {
      setCurrentQuestion({ ...question });
    } else {
      setCurrentQuestion({
        id: questions.length > 0 ? Math.max(...questions.map(q => q.id)) + 1 : 1,
        question: '',
        code: '',
        topic: '',
        difficulty: 'medium',
        options: ['', '', '', ''],
        correctOptionIndex: 0,
        explanation: ''
      });
    }
    setOpenQuestionDialog(true);
  };
  
  const handleQuestionChange = (e) => {
    setCurrentQuestion({
      ...currentQuestion,
      question: e.target.value
    });
  };
  
  const handleCodeChange = (e) => {
    setCurrentQuestion({
      ...currentQuestion,
      code: e.target.value
    });
  };
  
  const handleTopicChange = (e) => {
    setCurrentQuestion({
      ...currentQuestion,
      topic: e.target.value
    });
  };
  
  const handleDifficultyChange = (e) => {
    setCurrentQuestion({
      ...currentQuestion,
      difficulty: e.target.value
    });
  };
  
  const handleCorrectOptionChange = (e) => {
    setCurrentQuestion({
      ...currentQuestion,
      correctOptionIndex: parseInt(e.target.value)
    });
  };
  
  const handleExplanationChange = (e) => {
    setCurrentQuestion({
      ...currentQuestion,
      explanation: e.target.value
    });
  };
  
  // Search and filter handlers
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };
  
  const handleFilterChange = (type, value) => {
    setFilter({
      ...filter,
      [type]: value
    });
  };
  
  // Filter and search questions
  const filteredQuestions = questions.filter(q => {
    const matchesSearch = q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         q.topic.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTopic = filter.topic === 'all' || q.topic === filter.topic;
    const matchesDifficulty = filter.difficulty === 'all' || q.difficulty === filter.difficulty;
    
    return matchesSearch && matchesTopic && matchesDifficulty;
  });
  
  // Render difficulty chip
  const renderDifficultyChip = (difficulty) => {
    const color = 
      difficulty === 'Easy' ? 'success' :
      difficulty === 'Medium' ? 'primary' : 'error';
      
    return (
      <Chip 
        size="small" 
        label={difficulty} 
        color={color} 
        variant="outlined"
      />
    );
  };
  
  return (
    <>
      <AuthRedirect requireAdmin={true} />
      
      <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
          {/* Debug Info */}
          <Box sx={{ mb: 4 }}>
            <Alert severity="info" sx={{ mb: 2 }}>
              <Typography variant="subtitle2">Authentication Status in QuizManagement:</Typography>
              <Typography variant="body2">
                User: {user ? user.email : 'Not logged in'}<br />
                Admin: {user?.isAdmin ? 'Yes' : 'No'}<br />
                Loading: {authLoading ? 'Yes' : 'No'}
              </Typography>
            </Alert>
          </Box>
        
          <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
              Quiz Management
            </Typography>
            <Button 
              variant="outlined" 
              color="primary"
              startIcon={<RefreshIcon />}
              onClick={() => setDataLoading(true)}
              disabled={dataLoading}
            >
              Refresh Data
            </Button>
          </Box>
          
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange} 
            sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}
          >
            <Tab label="Topics" />
            <Tab label="Questions" />
            <Tab label="Settings" />
          </Tabs>
          
          {/* Topics Tab */}
          {tabValue === 0 && (
            <Box>
              <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6">Quiz Topics</Typography>
                <Button 
                  variant="contained" 
                  color="primary" 
                  startIcon={<AddIcon />}
                  onClick={handleOpenTopicDialog}
                >
                  Add Topic
                </Button>
              </Box>
              
              {dataLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                  <CircularProgress />
                </Box>
              ) : (
                <Grid container spacing={3}>
                  {topics.map(topic => (
                    <Grid item xs={12} sm={6} md={4} key={topic.id}>
                      <Card sx={{ height: '100%' }}>
                        <CardContent>
                          <Typography variant="h6" gutterBottom>{topic.name}</Typography>
                          <Chip 
                            label={`${topic.questionCount} questions`} 
                            color="primary" 
                            variant="outlined" 
                            size="small" 
                            sx={{ mb: 2 }}
                          />
                        </CardContent>
                        <CardActions sx={{ justifyContent: 'flex-end', p: 2, pt: 0 }}>
                          <IconButton 
                            color="error" 
                            onClick={() => handleDeleteTopic(topic.id)}
                          >
                            <DeleteIcon />
                          </IconButton>
                          <IconButton color="primary">
                            <EditIcon />
                          </IconButton>
                        </CardActions>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              )}
            </Box>
          )}
          
          {/* Questions Tab */}
          {tabValue === 1 && (
            <Box>
              <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6">Quiz Questions</Typography>
                <Button 
                  variant="contained" 
                  color="primary" 
                  startIcon={<AddIcon />}
                  onClick={handleOpenDialog}
                >
                  Add Question
                </Button>
              </Box>
              
              {dataLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                  <CircularProgress />
                </Box>
              ) : (
                <Grid container spacing={3}>
                  {filteredQuestions.length > 0 ? (
                    filteredQuestions.map((question) => (
                      <Grid item xs={12} key={question.id}>
                        <Card>
                          <CardContent>
                            <Box sx={{ display: 'flex', mb: 2, justifyContent: 'space-between' }}>
                              <Box>
                                <Chip 
                                  label={question.topic} 
                                  color="primary" 
                                  size="small" 
                                  sx={{ mr: 1 }}
                                />
                                {renderDifficultyChip(question.difficulty)}
                              </Box>
                              <Box>
                                <IconButton 
                                  size="small" 
                                  color="error"
                                  onClick={() => handleDeleteQuestion(question.id)}
                                >
                                  <DeleteIcon />
                                </IconButton>
                                <IconButton size="small" color="primary">
                                  <EditIcon />
                                </IconButton>
                              </Box>
                            </Box>
                            
                            <Typography variant="body1" gutterBottom sx={{ fontWeight: 'medium', whiteSpace: 'pre-line' }}>
                              {question.question}
                            </Typography>
                            
                            {question.code && (
                              <Box sx={{ mt: 1, display: 'flex', alignItems: 'center' }}>
                                <CodeIcon fontSize="small" color="action" sx={{ mr: 0.5 }} />
                                <Typography variant="body2" color="text.secondary" noWrap>
                                  Code sample included
                                </Typography>
                              </Box>
                            )}
                          </CardContent>
                        </Card>
                      </Grid>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} align="center">
                        <Typography sx={{ my: 2 }}>
                          No questions found matching your criteria.
                        </Typography>
                        <Button 
                          variant="outlined" 
                          size="small" 
                          startIcon={<RefreshIcon />}
                          onClick={() => {
                            setSearchQuery('');
                            setFilter({ topic: 'all', difficulty: 'all' });
                          }}
                        >
                          Reset Filters
                        </Button>
                      </TableCell>
                    </TableRow>
                  )}
                </Grid>
              )}
            </Box>
          )}
          
          {/* Settings Tab */}
          {tabValue === 2 && (
            <Box>
              <Typography variant="h6" gutterBottom>Quiz Settings</Typography>
              <Typography variant="body1" color="text.secondary" gutterBottom>
                Configure general settings for the quiz system
              </Typography>
              
              <Box sx={{ mt: 3 }}>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Default Questions Per Quiz"
                      type="number"
                      defaultValue={10}
                      fullWidth
                      InputProps={{ inputProps: { min: 5, max: 50 } }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel>Default Difficulty</InputLabel>
                      <Select
                        label="Default Difficulty"
                        defaultValue="Adaptive"
                      >
                        <MenuItem value="Adaptive">Adaptive</MenuItem>
                        <MenuItem value="Easy">Easy</MenuItem>
                        <MenuItem value="Medium">Medium</MenuItem>
                        <MenuItem value="Hard">Hard</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <Button 
                      variant="contained" 
                      color="primary"
                      startIcon={<SaveIcon />}
                      sx={{ mt: 2 }}
                    >
                      Save Settings
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </Box>
          )}
        </Paper>
        
        {/* Add Topic Dialog */}
        <Dialog open={openTopicDialog} onClose={handleCloseTopicDialog}>
          <DialogTitle>Add New Topic</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Topic Name"
              fullWidth
              variant="outlined"
              value={newTopic.name}
              onChange={(e) => setNewTopic({ ...newTopic, name: e.target.value })}
              sx={{ mt: 1 }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseTopicDialog}>Cancel</Button>
            <Button onClick={handleSaveTopic} variant="contained" color="primary">
              Add Topic
            </Button>
          </DialogActions>
        </Dialog>
        
        {/* Add Question Dialog */}
        <Dialog open={openQuestionDialog} onClose={handleCloseQuestionDialog} maxWidth="md" fullWidth>
          <DialogTitle>
            {currentQuestion.id && questions.some(q => q.id === currentQuestion.id) 
              ? 'Edit Question' 
              : 'Create New Question'
            }
          </DialogTitle>
          <DialogContent dividers>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  label="Question Text"
                  fullWidth
                  multiline
                  rows={2}
                  variant="outlined"
                  required
                  value={currentQuestion.question}
                  onChange={handleQuestionChange}
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  label="Code Sample (Optional)"
                  fullWidth
                  multiline
                  rows={4}
                  variant="outlined"
                  placeholder="def example():\n    return 'Hello World'"
                  value={currentQuestion.code}
                  onChange={handleCodeChange}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <FormControl fullWidth required>
                  <InputLabel>Topic</InputLabel>
                  <Select
                    value={currentQuestion.topic}
                    label="Topic"
                    onChange={handleTopicChange}
                  >
                    {topics.map((topic, index) => (
                      <MenuItem key={index} value={topic}>{topic}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <FormControl fullWidth required>
                  <InputLabel>Difficulty Level</InputLabel>
                  <Select
                    value={currentQuestion.difficulty}
                    label="Difficulty Level"
                    onChange={handleDifficultyChange}
                  >
                    <MenuItem value="Easy">Easy</MenuItem>
                    <MenuItem value="Medium">Medium</MenuItem>
                    <MenuItem value="Hard">Hard</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>
                  Answer Options
                </Typography>
                <Divider />
              </Grid>
              
              {currentQuestion.options.map((option, index) => (
                <Grid item xs={12} key={index}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <FormControl sx={{ width: '100px', mr: 2 }}>
                      <InputLabel>Correct?</InputLabel>
                      <Select
                        value={currentQuestion.correctOptionIndex === index ? '1' : '0'}
                        label="Correct?"
                        onChange={handleCorrectOptionChange}
                      >
                        <MenuItem value="1">Yes</MenuItem>
                        <MenuItem value="0">No</MenuItem>
                      </Select>
                    </FormControl>
                    <TextField
                      label={`Option ${index + 1}`}
                      fullWidth
                      variant="outlined"
                      required
                      value={option}
                      onChange={(e) => handleOptionChange(index, e.target.value)}
                    />
                  </Box>
                </Grid>
              ))}
              
              <Grid item xs={12}>
                <TextField
                  label="Explanation (shown after answering)"
                  fullWidth
                  multiline
                  rows={2}
                  variant="outlined"
                  value={currentQuestion.explanation}
                  onChange={handleExplanationChange}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseQuestionDialog}>Cancel</Button>
            <Button 
              onClick={() => {
                setDataLoading(true);
                handleSaveQuestion();
              }} 
              variant="contained"
              startIcon={<SaveIcon />}
              disabled={dataLoading}
            >
              {dataLoading ? 'Saving...' : 'Save Question'}
            </Button>
          </DialogActions>
        </Dialog>
        
        {/* Snackbar for notifications */}
        <Snackbar 
          open={snackbar.open} 
          autoHideDuration={4000} 
          onClose={handleCloseSnackbar}
        >
          <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} variant="filled">
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </>
  );
};

export default QuizManagement; 