import React, { useState, useEffect } from 'react';
import {
  Container, Typography, Paper, Box, Grid,
  Card, CardContent, TextField, Button,
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Chip, IconButton,
  Tabs, Tab, Divider, Avatar, CircularProgress,
  List, ListItem, ListItemText, ListItemAvatar,
  FormControl, InputLabel, Select, MenuItem
} from '@mui/material';
import {
  Person as PersonIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  BarChart as BarChartIcon,
  Refresh as RefreshIcon,
  ViewList as ViewListIcon,
  Assignment as AssignmentIcon,
  Timeline as TimelineIcon,
  Psychology as PsychologyIcon
} from '@mui/icons-material';
import AuthRedirect from '../auth/AuthRedirect';

const UserAnalytics = () => {
  // State
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [tabValue, setTabValue] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [statsTimeframe, setStatsTimeframe] = useState('month');
  const [sortBy, setSortBy] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');

  // Mock data for users
  const mockUsers = [
    {
      id: 1,
      name: "Sarah Johnson",
      email: "sarah.j@example.com",
      joinDate: "2023-10-15",
      profilePic: "",
      stats: {
        totalQuizzes: 24,
        averageScore: 87,
        topicsStrong: ["Basic Python", "Data Types"],
        topicsWeak: ["Object-Oriented Programming"],
        lastActive: "2023-05-12",
        completionRate: 92,
        timeSpent: "18h 45m",
        difficulty: "Intermediate"
      },
      quizHistory: [
        { id: 101, date: "2023-05-10", topic: "Basic Python", score: 95, totalQuestions: 10, timeSpent: "12m" },
        { id: 102, date: "2023-05-08", topic: "Data Types", score: 80, totalQuestions: 10, timeSpent: "15m" },
        { id: 103, date: "2023-05-05", topic: "OOP", score: 65, totalQuestions: 10, timeSpent: "22m" }
      ]
    },
    {
      id: 2,
      name: "Michael Chen",
      email: "mchen@example.com",
      joinDate: "2023-09-28",
      profilePic: "",
      stats: {
        totalQuizzes: 15,
        averageScore: 72,
        topicsStrong: ["Control Flow"],
        topicsWeak: ["Exception Handling", "File I/O"],
        lastActive: "2023-05-11",
        completionRate: 78,
        timeSpent: "12h 20m",
        difficulty: "Beginner"
      },
      quizHistory: [
        { id: 201, date: "2023-05-11", topic: "Control Flow", score: 85, totalQuestions: 10, timeSpent: "14m" },
        { id: 202, date: "2023-05-07", topic: "Exception Handling", score: 60, totalQuestions: 10, timeSpent: "18m" }
      ]
    },
    {
      id: 3,
      name: "Alex Rodriguez",
      email: "alex.r@example.com",
      joinDate: "2023-11-02",
      profilePic: "",
      stats: {
        totalQuizzes: 32,
        averageScore: 91,
        topicsStrong: ["Functions", "OOP", "Data Types"],
        topicsWeak: [],
        lastActive: "2023-05-12",
        completionRate: 98,
        timeSpent: "24h 10m",
        difficulty: "Advanced"
      },
      quizHistory: [
        { id: 301, date: "2023-05-12", topic: "Functions", score: 100, totalQuestions: 10, timeSpent: "9m" },
        { id: 302, date: "2023-05-09", topic: "OOP", score: 90, totalQuestions: 10, timeSpent: "13m" },
        { id: 303, date: "2023-05-06", topic: "Data Types", score: 95, totalQuestions: 10, timeSpent: "11m" }
      ]
    },
    {
      id: 4,
      name: "Emma Wilson",
      email: "emma.w@example.com",
      joinDate: "2023-10-05",
      profilePic: "",
      stats: {
        totalQuizzes: 8,
        averageScore: 69,
        topicsStrong: ["Basic Python"],
        topicsWeak: ["Functions", "List Comprehension"],
        lastActive: "2023-05-08",
        completionRate: 65,
        timeSpent: "7h 40m",
        difficulty: "Beginner"
      },
      quizHistory: [
        { id: 401, date: "2023-05-08", topic: "Basic Python", score: 80, totalQuestions: 10, timeSpent: "16m" },
        { id: 402, date: "2023-05-03", topic: "Functions", score: 55, totalQuestions: 10, timeSpent: "20m" }
      ]
    },
    {
      id: 5,
      name: "Daniel Kim",
      email: "dkim@example.com",
      joinDate: "2023-09-15",
      profilePic: "",
      stats: {
        totalQuizzes: 20,
        averageScore: 83,
        topicsStrong: ["Data Types", "Control Flow"],
        topicsWeak: ["File I/O"],
        lastActive: "2023-05-10",
        completionRate: 88,
        timeSpent: "15h 50m",
        difficulty: "Intermediate"
      },
      quizHistory: [
        { id: 501, date: "2023-05-10", topic: "Data Types", score: 90, totalQuestions: 10, timeSpent: "13m" },
        { id: 502, date: "2023-05-07", topic: "Control Flow", score: 85, totalQuestions: 10, timeSpent: "15m" },
        { id: 503, date: "2023-05-04", topic: "File I/O", score: 70, totalQuestions: 10, timeSpent: "19m" }
      ]
    }
  ];

  // Fetch users on component mount
  useEffect(() => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setUsers(mockUsers);
      setLoading(false);
    }, 1000);
  }, []);

  // Handlers
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleUserSelect = (user) => {
    setSelectedUser(user);
  };

  const handleBackToList = () => {
    setSelectedUser(null);
  };

  const handleTimeframeChange = (event) => {
    setStatsTimeframe(event.target.value);
  };

  const handleSortChange = (field) => {
    if (sortBy === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortDirection('asc');
    }
  };

  // Filter users based on search
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sort users
  const sortedUsers = [...filteredUsers].sort((a, b) => {
    let comparison = 0;
    
    switch (sortBy) {
      case 'name':
        comparison = a.name.localeCompare(b.name);
        break;
      case 'quizzes':
        comparison = a.stats.totalQuizzes - b.stats.totalQuizzes;
        break;
      case 'score':
        comparison = a.stats.averageScore - b.stats.averageScore;
        break;
      case 'active':
        comparison = new Date(a.stats.lastActive) - new Date(b.stats.lastActive);
        break;
      default:
        comparison = 0;
    }
    
    return sortDirection === 'asc' ? comparison : -comparison;
  });

  // Get user difficulty level color
  const getDifficultyColor = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case 'beginner':
        return 'success';
      case 'intermediate':
        return 'primary';
      case 'advanced':
        return 'error';
      default:
        return 'default';
    }
  };

  // Calculate overall platform stats
  const platformStats = {
    totalUsers: users.length,
    activeUsers: users.filter(user => new Date(user.stats.lastActive) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length,
    averageScore: users.length > 0 ? Math.round(users.reduce((sum, user) => sum + user.stats.averageScore, 0) / users.length) : 0,
    totalQuizzes: users.reduce((sum, user) => sum + user.stats.totalQuizzes, 0),
    completionRate: users.length > 0 ? Math.round(users.reduce((sum, user) => sum + user.stats.completionRate, 0) / users.length) : 0
  };

  return (
    <>
      <AuthRedirect requireAdmin={true} />
      
      <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
          <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
              User Analytics
            </Typography>
            {selectedUser && (
              <Button
                variant="outlined"
                onClick={handleBackToList}
                startIcon={<ViewListIcon />}
              >
                Back to User List
              </Button>
            )}
          </Box>

          {!selectedUser ? (
            <>
              {/* Tabs */}
              <Tabs 
                value={tabValue}
                onChange={handleTabChange}
                sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}
              >
                <Tab label="User Overview" />
                <Tab label="Performance Analytics" />
                <Tab label="Topic Progress" />
              </Tabs>
              
              {tabValue === 0 && (
                <Box>
                  {/* Search and Sort Bar */}
                  <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <TextField
                        placeholder="Search users..."
                        variant="outlined"
                        size="small"
                        value={searchQuery}
                        onChange={handleSearchChange}
                        InputProps={{
                          startAdornment: <SearchIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                        }}
                        sx={{ width: '300px' }}
                      />
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <FormControl size="small" sx={{ width: '150px', ml: 2 }}>
                        <InputLabel>Sort By</InputLabel>
                        <Select
                          value={sortBy}
                          label="Sort By"
                          onChange={(e) => setSortBy(e.target.value)}
                        >
                          <MenuItem value="name">Name</MenuItem>
                          <MenuItem value="quizzes">Total Quizzes</MenuItem>
                          <MenuItem value="score">Average Score</MenuItem>
                          <MenuItem value="active">Last Active</MenuItem>
                        </Select>
                      </FormControl>
                      
                      <IconButton 
                        onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}
                        color="primary"
                      >
                        <FilterIcon />
                      </IconButton>
                    </Box>
                  </Box>
                  
                  {/* Platform Stats */}
                  <Grid container spacing={2} sx={{ mb: 4 }}>
                    <Grid item xs={12} sm={6} md={2.4}>
                      <Card variant="outlined" sx={{ height: '100%' }}>
                        <CardContent sx={{ textAlign: 'center' }}>
                          <Typography variant="subtitle2" color="text.secondary">
                            Total Users
                          </Typography>
                          <Typography variant="h4" sx={{ mt: 1, fontWeight: 'medium' }}>
                            {platformStats.totalUsers}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                    
                    <Grid item xs={12} sm={6} md={2.4}>
                      <Card variant="outlined" sx={{ height: '100%' }}>
                        <CardContent sx={{ textAlign: 'center' }}>
                          <Typography variant="subtitle2" color="text.secondary">
                            Active Users (7d)
                          </Typography>
                          <Typography variant="h4" sx={{ mt: 1, fontWeight: 'medium' }}>
                            {platformStats.activeUsers}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                    
                    <Grid item xs={12} sm={6} md={2.4}>
                      <Card variant="outlined" sx={{ height: '100%' }}>
                        <CardContent sx={{ textAlign: 'center' }}>
                          <Typography variant="subtitle2" color="text.secondary">
                            Avg. Score
                          </Typography>
                          <Typography variant="h4" sx={{ mt: 1, fontWeight: 'medium' }}>
                            {platformStats.averageScore}%
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                    
                    <Grid item xs={12} sm={6} md={2.4}>
                      <Card variant="outlined" sx={{ height: '100%' }}>
                        <CardContent sx={{ textAlign: 'center' }}>
                          <Typography variant="subtitle2" color="text.secondary">
                            Total Quizzes
                          </Typography>
                          <Typography variant="h4" sx={{ mt: 1, fontWeight: 'medium' }}>
                            {platformStats.totalQuizzes}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                    
                    <Grid item xs={12} sm={6} md={2.4}>
                      <Card variant="outlined" sx={{ height: '100%' }}>
                        <CardContent sx={{ textAlign: 'center' }}>
                          <Typography variant="subtitle2" color="text.secondary">
                            Completion Rate
                          </Typography>
                          <Typography variant="h4" sx={{ mt: 1, fontWeight: 'medium' }}>
                            {platformStats.completionRate}%
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  </Grid>
                  
                  {/* User List */}
                  {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                      <CircularProgress />
                    </Box>
                  ) : (
                    <TableContainer component={Paper} variant="outlined">
                      <Table sx={{ minWidth: 650 }}>
                        <TableHead>
                          <TableRow sx={{ backgroundColor: 'rgba(0, 0, 0, 0.04)' }}>
                            <TableCell>
                              <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={() => handleSortChange('name')}>
                                User
                                {sortBy === 'name' && (
                                  <Typography variant="caption" sx={{ ml: 0.5 }}>
                                    {sortDirection === 'asc' ? '↑' : '↓'}
                                  </Typography>
                                )}
                              </Box>
                            </TableCell>
                            <TableCell align="center">
                              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }} onClick={() => handleSortChange('quizzes')}>
                                Quizzes
                                {sortBy === 'quizzes' && (
                                  <Typography variant="caption" sx={{ ml: 0.5 }}>
                                    {sortDirection === 'asc' ? '↑' : '↓'}
                                  </Typography>
                                )}
                              </Box>
                            </TableCell>
                            <TableCell align="center">
                              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }} onClick={() => handleSortChange('score')}>
                                Avg. Score
                                {sortBy === 'score' && (
                                  <Typography variant="caption" sx={{ ml: 0.5 }}>
                                    {sortDirection === 'asc' ? '↑' : '↓'}
                                  </Typography>
                                )}
                              </Box>
                            </TableCell>
                            <TableCell align="center">Level</TableCell>
                            <TableCell align="center">
                              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }} onClick={() => handleSortChange('active')}>
                                Last Active
                                {sortBy === 'active' && (
                                  <Typography variant="caption" sx={{ ml: 0.5 }}>
                                    {sortDirection === 'asc' ? '↑' : '↓'}
                                  </Typography>
                                )}
                              </Box>
                            </TableCell>
                            <TableCell align="center">Actions</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {sortedUsers.length > 0 ? (
                            sortedUsers.map((user) => (
                              <TableRow key={user.id} hover>
                                <TableCell>
                                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                                      {user.name.charAt(0)}
                                    </Avatar>
                                    <Box>
                                      <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                                        {user.name}
                                      </Typography>
                                      <Typography variant="body2" color="text.secondary">
                                        {user.email}
                                      </Typography>
                                    </Box>
                                  </Box>
                                </TableCell>
                                <TableCell align="center">{user.stats.totalQuizzes}</TableCell>
                                <TableCell align="center">
                                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Box
                                      sx={{
                                        display: 'inline-flex',
                                        position: 'relative',
                                        width: 40,
                                        height: 40,
                                        mr: 1
                                      }}
                                    >
                                      <CircularProgress
                                        variant="determinate"
                                        value={user.stats.averageScore}
                                        size={40}
                                        thickness={4}
                                        sx={{
                                          color: user.stats.averageScore >= 80 ? 'success.main' : 
                                                 user.stats.averageScore >= 60 ? 'warning.main' : 'error.main'
                                        }}
                                      />
                                      <Box
                                        sx={{
                                          top: 0,
                                          left: 0,
                                          bottom: 0,
                                          right: 0,
                                          position: 'absolute',
                                          display: 'flex',
                                          alignItems: 'center',
                                          justifyContent: 'center',
                                        }}
                                      >
                                        <Typography variant="caption" fontWeight="bold">
                                          {user.stats.averageScore}%
                                        </Typography>
                                      </Box>
                                    </Box>
                                  </Box>
                                </TableCell>
                                <TableCell align="center">
                                  <Chip 
                                    label={user.stats.difficulty} 
                                    color={getDifficultyColor(user.stats.difficulty)}
                                    size="small"
                                    variant="outlined"
                                  />
                                </TableCell>
                                <TableCell align="center">
                                  {new Date(user.stats.lastActive).toLocaleDateString()}
                                </TableCell>
                                <TableCell align="center">
                                  <Button 
                                    variant="outlined" 
                                    size="small"
                                    color="primary"
                                    onClick={() => handleUserSelect(user)}
                                  >
                                    View Details
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))
                          ) : (
                            <TableRow>
                              <TableCell colSpan={6} align="center">
                                <Typography variant="body1" sx={{ my: 3 }}>
                                  No users found matching your search criteria.
                                </Typography>
                                <Button 
                                  variant="outlined" 
                                  size="small" 
                                  startIcon={<RefreshIcon />}
                                  onClick={() => setSearchQuery('')}
                                >
                                  Clear Search
                                </Button>
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  )}
                </Box>
              )}
              
              {tabValue === 1 && (
                <Box>
                  <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography variant="h6">
                      Aggregate Performance Analysis
                    </Typography>
                    
                    <FormControl size="small" sx={{ width: '150px' }}>
                      <InputLabel>Timeframe</InputLabel>
                      <Select
                        value={statsTimeframe}
                        label="Timeframe"
                        onChange={handleTimeframeChange}
                      >
                        <MenuItem value="week">Past Week</MenuItem>
                        <MenuItem value="month">Past Month</MenuItem>
                        <MenuItem value="quarter">Past 3 Months</MenuItem>
                        <MenuItem value="year">Past Year</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>
                  
                  <Grid container spacing={3}>
                    {/* Performance metrics would go here */}
                    <Grid item xs={12}>
                      <Card variant="outlined">
                        <CardContent>
                          <Typography variant="h6" gutterBottom>
                            Quiz Completion Rates
                          </Typography>
                          <Box sx={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Typography color="text.secondary">
                              Performance charts would appear here.
                            </Typography>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <Card variant="outlined">
                        <CardContent>
                          <Typography variant="h6" gutterBottom>
                            Topic Performance
                          </Typography>
                          <Box sx={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Typography color="text.secondary">
                              Topic performance visualization would appear here.
                            </Typography>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <Card variant="outlined">
                        <CardContent>
                          <Typography variant="h6" gutterBottom>
                            Time Distribution
                          </Typography>
                          <Box sx={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Typography color="text.secondary">
                              Time spent visualization would appear here.
                            </Typography>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  </Grid>
                </Box>
              )}
              
              {tabValue === 2 && (
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Topic Mastery Across Users
                  </Typography>
                  
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    This view shows the distribution of topic mastery across all users.
                  </Typography>
                  
                  <Grid container spacing={2}>
                    {["Basic Python", "Functions", "Data Types", "Control Flow", "OOP"].map((topic, index) => (
                      <Grid item xs={12} key={index}>
                        <Card variant="outlined">
                          <CardContent>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                              <Typography variant="subtitle1" fontWeight="medium">
                                {topic}
                              </Typography>
                              <Box>
                                <Chip 
                                  size="small" 
                                  label="Beginner" 
                                  color="success" 
                                  variant="outlined"
                                  sx={{ mr: 1 }}
                                />
                                <Chip 
                                  size="small" 
                                  label="Intermediate" 
                                  color="primary" 
                                  variant="outlined"
                                  sx={{ mr: 1 }}
                                />
                                <Chip 
                                  size="small" 
                                  label="Advanced" 
                                  color="error" 
                                  variant="outlined"
                                />
                              </Box>
                            </Box>
                            <Box sx={{ width: '100%', height: '10px', bgcolor: '#f0f0f0', borderRadius: '5px', overflow: 'hidden', display: 'flex' }}>
                              <Box sx={{ width: '30%', height: '100%', bgcolor: 'success.main' }} />
                              <Box sx={{ width: '45%', height: '100%', bgcolor: 'primary.main' }} />
                              <Box sx={{ width: '25%', height: '100%', bgcolor: 'error.main' }} />
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                              <Typography variant="caption">30% Beginner</Typography>
                              <Typography variant="caption">45% Intermediate</Typography>
                              <Typography variant="caption">25% Advanced</Typography>
                            </Box>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              )}
            </>
          ) : (
            // User Detail View
            <Box>
              <Box sx={{ mb: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Avatar sx={{ width: 80, height: 80, mr: 3, bgcolor: 'primary.main', fontSize: 36 }}>
                    {selectedUser.name.charAt(0)}
                  </Avatar>
                  <Box>
                    <Typography variant="h5" gutterBottom>
                      {selectedUser.name}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      {selectedUser.email}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Member since: {new Date(selectedUser.joinDate).toLocaleDateString()}
                    </Typography>
                  </Box>
                </Box>
                
                <Divider sx={{ mb: 3 }} />
                
                {/* User Stats */}
                <Typography variant="h6" gutterBottom>
                  User Performance
                </Typography>
                
                <Grid container spacing={2} sx={{ mb: 4 }}>
                  <Grid item xs={6} sm={3}>
                    <Card variant="outlined" sx={{ height: '100%' }}>
                      <CardContent sx={{ textAlign: 'center' }}>
                        <AssignmentIcon color="primary" sx={{ mb: 1 }} />
                        <Typography variant="subtitle2" color="text.secondary">
                          Total Quizzes
                        </Typography>
                        <Typography variant="h5" sx={{ mt: 1 }}>
                          {selectedUser.stats.totalQuizzes}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  
                  <Grid item xs={6} sm={3}>
                    <Card variant="outlined" sx={{ height: '100%' }}>
                      <CardContent sx={{ textAlign: 'center' }}>
                        <BarChartIcon color="primary" sx={{ mb: 1 }} />
                        <Typography variant="subtitle2" color="text.secondary">
                          Average Score
                        </Typography>
                        <Typography variant="h5" sx={{ mt: 1 }}>
                          {selectedUser.stats.averageScore}%
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  
                  <Grid item xs={6} sm={3}>
                    <Card variant="outlined" sx={{ height: '100%' }}>
                      <CardContent sx={{ textAlign: 'center' }}>
                        <TimelineIcon color="primary" sx={{ mb: 1 }} />
                        <Typography variant="subtitle2" color="text.secondary">
                          Completion Rate
                        </Typography>
                        <Typography variant="h5" sx={{ mt: 1 }}>
                          {selectedUser.stats.completionRate}%
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  
                  <Grid item xs={6} sm={3}>
                    <Card variant="outlined" sx={{ height: '100%' }}>
                      <CardContent sx={{ textAlign: 'center' }}>
                        <PsychologyIcon color="primary" sx={{ mb: 1 }} />
                        <Typography variant="subtitle2" color="text.secondary">
                          Difficulty Level
                        </Typography>
                        <Typography variant="h5" sx={{ mt: 1 }}>
                          {selectedUser.stats.difficulty}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
                
                {/* Topic Strengths and Weaknesses */}
                <Grid container spacing={3} sx={{ mb: 4 }}>
                  <Grid item xs={12} md={6}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="subtitle1" gutterBottom fontWeight="medium">
                          Strong Topics
                        </Typography>
                        <Divider sx={{ mb: 2 }} />
                        
                        {selectedUser.stats.topicsStrong.length > 0 ? (
                          <List dense>
                            {selectedUser.stats.topicsStrong.map((topic, index) => (
                              <ListItem key={index}>
                                <ListItemText primary={topic} />
                                <Chip size="small" label="Strong" color="success" />
                              </ListItem>
                            ))}
                          </List>
                        ) : (
                          <Typography variant="body2" color="text.secondary">
                            No strong topics identified yet.
                          </Typography>
                        )}
                      </CardContent>
                    </Card>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="subtitle1" gutterBottom fontWeight="medium">
                          Areas for Improvement
                        </Typography>
                        <Divider sx={{ mb: 2 }} />
                        
                        {selectedUser.stats.topicsWeak.length > 0 ? (
                          <List dense>
                            {selectedUser.stats.topicsWeak.map((topic, index) => (
                              <ListItem key={index}>
                                <ListItemText primary={topic} />
                                <Chip size="small" label="Needs Work" color="error" />
                              </ListItem>
                            ))}
                          </List>
                        ) : (
                          <Typography variant="body2" color="text.secondary">
                            No weak topics identified yet.
                          </Typography>
                        )}
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
                
                {/* Quiz History */}
                <Typography variant="h6" gutterBottom>
                  Recent Quiz History
                </Typography>
                
                <TableContainer component={Paper} variant="outlined">
                  <Table size="small">
                    <TableHead>
                      <TableRow sx={{ backgroundColor: 'rgba(0, 0, 0, 0.04)' }}>
                        <TableCell>Date</TableCell>
                        <TableCell>Topic</TableCell>
                        <TableCell align="center">Score</TableCell>
                        <TableCell align="center">Questions</TableCell>
                        <TableCell align="center">Time Spent</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {selectedUser.quizHistory.map((quiz) => (
                        <TableRow key={quiz.id} hover>
                          <TableCell>{new Date(quiz.date).toLocaleDateString()}</TableCell>
                          <TableCell>{quiz.topic}</TableCell>
                          <TableCell align="center">
                            <Chip 
                              size="small" 
                              label={`${quiz.score}%`} 
                              color={
                                quiz.score >= 80 ? 'success' : 
                                quiz.score >= 60 ? 'primary' : 'error'
                              }
                            />
                          </TableCell>
                          <TableCell align="center">{quiz.totalQuestions}</TableCell>
                          <TableCell align="center">{quiz.timeSpent}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            </Box>
          )}
        </Paper>
      </Container>
    </>
  );
};

export default UserAnalytics; 