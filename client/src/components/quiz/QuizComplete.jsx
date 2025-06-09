import React, { useEffect } from 'react';
import { 
    Box, Typography, Button, Paper, 
    Container, Grid, CircularProgress, 
    List, ListItem, ListItemIcon, ListItemText, Divider,
    Card, CardContent, Chip, Avatar, Rating, Tooltip,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    LinearProgress
} from '@mui/material';
import { 
    Check, Close, TrendingUp, TrendingDown, 
    Timer, School, Psychology, EmojiEvents,
    Speed, Insights, Lightbulb, BarChart,
    Assignment, Star, StarBorder, ArrowUpward, ArrowForward,
    Recommend, CheckCircle, Error, Info, ArrowRightAlt
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { linkedinColors } from '../../theme';
import { PieChart, Pie, Cell, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar } from 'recharts';

const QuizComplete = ({ stats, analysis, knowledgeState, onRetakeQuiz }) => {
    const navigate = useNavigate();
    
    // Debug props on mount
    useEffect(() => {
        console.log("QuizComplete mounted with props:", {
            hasStats: !!stats,
            statsData: stats,
            hasAnalysis: !!analysis,
            analysisData: analysis,
            hasKnowledgeState: !!knowledgeState
        });
    }, []);
    
    // Save quiz results to localStorage when component mounts
    useEffect(() => {
        if (stats && analysis) {
            try {
                saveQuizResultsToUserData(stats, analysis, knowledgeState);
            } catch (error) {
                console.error("Error in useEffect when saving results:", error);
            }
        }
    }, [stats, analysis, knowledgeState]);
    
    // Function to save quiz results to user data
    const saveQuizResultsToUserData = (stats, analysis, knowledgeState) => {
        try {
            // Get current user data from localStorage
            const userDataString = localStorage.getItem('userData');
            if (!userDataString) {
                console.warn('No user data found in localStorage');
                return;
            }
            
            const userData = JSON.parse(userDataString);
            
            // Create quiz history entry
            const quizEntry = {
                id: `quiz-${Date.now()}`,
                date: new Date().toLocaleDateString(),
                score: analysis.accuracy ? Math.round(analysis.accuracy * 100) : 0,
                questions: analysis.total_questions || 0,
                topics: Object.keys(analysis.proficiency_breakdown || {})
            };
            
            // Initialize quiz_history array if it doesn't exist
            if (!userData.quiz_history) {
                userData.quiz_history = [];
            }
            
            // Add new quiz to history
            userData.quiz_history.unshift(quizEntry);
            
            // Update knowledge state with latest data
            userData.knowledge_state = knowledgeState;
            
            // Save updated user data
            localStorage.setItem('userData', JSON.stringify(userData));
            
            console.log('Quiz results saved to user profile:', quizEntry);
        } catch (error) {
            console.error('Error saving quiz results to user data:', error);
        }
    };
    
    if (!stats || !analysis) {
        console.warn("Missing required data for QuizComplete:", {
            hasStats: !!stats,
            statsKeys: stats ? Object.keys(stats) : null,
            hasAnalysis: !!analysis,
            analysisKeys: analysis ? Object.keys(analysis) : null
        });
        
        return (
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Paper sx={{ p: 4, textAlign: 'center' }}>
                    <Typography variant="h4" color="error" gutterBottom>
                        Missing Quiz Results Data
                    </Typography>
                    <Box sx={{ mb: 2 }}>
                        <CircularProgress size={40} />
                    </Box>
                    <Typography paragraph color="text.secondary">
                        {!stats && !analysis 
                            ? "Both stats and analysis data are missing."
                            : !stats 
                                ? "Stats data is missing." 
                                : "Analysis data is missing."}
                    </Typography>
                    <Button 
                        variant="contained" 
                        color="primary" 
                        onClick={onRetakeQuiz}
                        sx={{ mt: 2 }}
                    >
                        Try Again
                    </Button>
                </Paper>
            </Container>
        );
    }
    
    // Move data extraction inside the try block
    const accuracy = analysis.accuracy || 0;
    const accuracyPercent = Math.round(accuracy * 100);
    const overallProficiency = analysis.overall_proficiency || '0%';
    const performanceLevel = analysis.performance_level || 'Beginner';
    const strengths = analysis.strengths || [];
    const weaknesses = analysis.weaknesses || [];
    const recommendations = analysis.recommendations || [];
    const insights = analysis.performance_insights || [];
    const proficiencyBreakdown = analysis.proficiency_breakdown || {};
    const topicsCovered = analysis.topics_covered || [];
    
    // Prepare data for charts
    const pieData = [
        { name: 'Correct', value: analysis.correct_answers || 0, color: '#4caf50' },
        { name: 'Incorrect', value: (analysis.total_questions || 0) - (analysis.correct_answers || 0), color: '#f44336' }
    ];
    
    // Prepare radar data using only topics covered in this quiz
    const radarData = Object.entries(proficiencyBreakdown)
        .filter(([topic, _]) => topicsCovered.includes(topic))
        .map(([topic, score]) => ({
            subject: topic,
            A: parseFloat(score.replace('%', '')),
            fullMark: 100
        }));
    
    // Get performance level based on overall proficiency
    const getPerformanceLevel = (level) => {
        switch(level) {
            case 'Expert':
                return { color: '#4caf50', icon: <EmojiEvents />, rating: 5 };
            case 'Advanced':
                return { color: '#8bc34a', icon: <TrendingUp />, rating: 4 };
            case 'Intermediate':
                return { color: '#ffeb3b', icon: <School />, rating: 3 };
            case 'Beginner':
                return { color: '#ff9800', icon: <Psychology />, rating: 2 };
            default:
                return { color: '#f44336', icon: <Lightbulb />, rating: 1 };
        }
    };
    
    const performanceInfo = getPerformanceLevel(performanceLevel);
    
    try {
        console.log("About to render QuizComplete with:", {
            performanceInfo,
            accuracy,
            overallProficiency
        });
        
        return (
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                        <Typography 
                            variant="h3" 
                            component="h1" 
                            sx={{ 
                                color: linkedinColors.primary,
                                fontWeight: 'bold',
                            }}
                        >
                            Assessment Results
                        </Typography>
                        
                        <Button 
                            variant="contained" 
                            color="primary" 
                            size="large"
                            onClick={onRetakeQuiz}
                            startIcon={<ArrowRightAlt />}
                            sx={{ 
                                borderRadius: 2,
                                px: 3,
                                py: 1.5,
                                boxShadow: 3,
                                '&:hover': {
                                    boxShadow: 6,
                                    transform: 'translateY(-2px)'
                                },
                                transition: 'all 0.2s'
                            }}
                        >
                            Retake Assessment
                        </Button>
                    </Box>
                    
                    {/* Performance Summary Card */}
                    <Paper 
                        elevation={3} 
                        sx={{ 
                            p: 4, 
                            mb: 4, 
                            borderRadius: 2,
                            background: 'linear-gradient(145deg, #1a2035, #2a3045)',
                            color: 'white',
                            boxShadow: '0 10px 20px rgba(0,0,0,0.1)'
                        }}
                    >
                        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'medium', color: 'white' }}>
                            Performance Summary
                        </Typography>
                        
                        <Grid container spacing={3} alignItems="center">
                            <Grid item xs={12} md={6}>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                    <Chip 
                                        icon={performanceInfo.icon} 
                                        label={`${performanceLevel} Level`} 
                                        sx={{ 
                                            bgcolor: performanceInfo.color, 
                                            color: 'white',
                                            fontWeight: 'bold',
                                            fontSize: '1rem',
                                            py: 2.5,
                                            mr: 2
                                        }} 
                                    />
                                    <Rating 
                                        value={performanceInfo.rating} 
                                        readOnly 
                                        max={5}
                                        size="large"
                                    />
                                </Box>
                                
                                <Box sx={{ mb: 3 }}>
                                    <Typography variant="h6" gutterBottom>
                                        Overall Proficiency: {overallProficiency}
                                    </Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                        <Box sx={{ width: '70%', mr: 2 }}>
                                            <LinearProgress 
                                                variant="determinate" 
                                                value={parseFloat(overallProficiency)} 
                                                sx={{ 
                                                    height: 10, 
                                                    borderRadius: 5,
                                                    bgcolor: 'rgba(255,255,255,0.2)',
                                                    '& .MuiLinearProgress-bar': {
                                                        background: `linear-gradient(90deg, ${performanceInfo.color}, ${performanceInfo.color}dd)`
                                                    }
                                                }}
                                            />
                                        </Box>
                                        <Typography variant="body1" fontWeight="bold">
                                            {overallProficiency}
                                        </Typography>
                                    </Box>
                                    
                                    <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                                        Questions Answered: {analysis.total_questions} of {stats.total}
                                    </Typography>
                                    <Typography variant="h6" gutterBottom>
                                        Correct Answers: {analysis.correct_answers} ({accuracyPercent}% accuracy)
                                    </Typography>
                                    <Typography variant="h6" gutterBottom>
                                        Total Score: {analysis.score} points
                                    </Typography>
                                </Box>
                            </Grid>
                            
                            <Grid item xs={12} md={6}>
                                <Box sx={{ height: 250 }}>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={pieData}
                                                cx="50%"
                                                cy="50%"
                                                labelLine={false}
                                                outerRadius={80}
                                                fill="#8884d8"
                                                dataKey="value"
                                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                            >
                                                {pieData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                ))}
                                            </Pie>
                                        </PieChart>
                                    </ResponsiveContainer>
                                </Box>
                            </Grid>
                        </Grid>
                    </Paper>
                    
                    {/* Analysis Summary Card */}
                    <Paper 
                        elevation={3} 
                        sx={{ 
                            p: 4, 
                            mb: 4, 
                            borderRadius: 2,
                            background: 'linear-gradient(145deg, #1a2035, #2a3045)',
                            color: 'white',
                            boxShadow: '0 10px 20px rgba(0,0,0,0.1)'
                        }}
                    >
                        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'medium', color: 'white' }}>
                            <Insights sx={{ mr: 1, verticalAlign: 'middle' }} />
                            Summary Analysis
                        </Typography>
                        
                        <Divider sx={{ my: 3, bgcolor: 'rgba(255,255,255,0.1)' }} />
                        
                        <Typography variant="body1" sx={{ 
                            lineHeight: 1.8, 
                            fontSize: '1.1rem', 
                            p: 2, 
                            bgcolor: 'rgba(255,255,255,0.05)',
                            borderRadius: 2,
                            borderLeft: '4px solid #0A66C2',
                            fontStyle: 'italic'
                        }}>
                            {analysis.summary || 'Your personalized analysis will help you identify strengths and areas for improvement.'}
                        </Typography>
                        
                        <Grid container spacing={3} mt={3}>
                            <Grid item xs={12} md={6}>
                                <Card sx={{ bgcolor: 'rgba(255,255,255,0.05)', height: '100%' }}>
                                    <CardContent>
                                        <Typography variant="h6" sx={{ 
                                            mb: 2, 
                                            display: 'flex', 
                                            alignItems: 'center',
                                            color: performanceInfo.color
                                        }}>
                                            <EmojiEvents sx={{ mr: 1 }} />
                                            Performance Level: {performanceLevel}
                                        </Typography>
                                        <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
                                            {analysis.performance_description || 'Keep practicing to improve your skills and knowledge.'}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Card sx={{ bgcolor: 'rgba(255,255,255,0.05)', height: '100%' }}>
                                    <CardContent>
                                        <Typography variant="h6" sx={{ 
                                            mb: 2, 
                                            display: 'flex', 
                                            alignItems: 'center',
                                            color: '#4caf50'
                                        }}>
                                            <Lightbulb sx={{ mr: 1 }} />
                                            Key Insights
                                        </Typography>
                                        {Array.isArray(insights) && insights.length > 0 ? (
                                            <List dense disablePadding>
                                                {insights.slice(0, 2).map((insight, index) => (
                                                    <ListItem key={index} disableGutters sx={{ mb: 1 }}>
                                                        <ListItemIcon sx={{ minWidth: 36 }}>
                                                            <Info sx={{ color: '#0A66C2' }} />
                                                        </ListItemIcon>
                                                        <ListItemText 
                                                            primary={
                                                                typeof insight === 'object' 
                                                                ? insight.insight 
                                                                : insight
                                                            }
                                                            secondary={
                                                                typeof insight === 'object' && insight.action
                                                                ? `Action: ${insight.action}`
                                                                : null
                                                            }
                                                        />
                                                    </ListItem>
                                                ))}
                                            </List>
                                        ) : (
                                            <Typography variant="body2">
                                                Continue practicing to gain more insights into your learning patterns.
                                            </Typography>
                                        )}
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>
                    </Paper>
                    
                    {/* Proficiency Breakdown */}
                    <Paper 
                        elevation={3} 
                        sx={{ 
                            p: 4, 
                            mb: 4, 
                            borderRadius: 2,
                            background: 'linear-gradient(145deg, #1a2035, #2a3045)',
                            color: 'white',
                            boxShadow: '0 10px 20px rgba(0,0,0,0.1)'
                        }}
                    >
                        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'medium', color: 'white' }}>
                            <BarChart sx={{ mr: 1, verticalAlign: 'middle' }} />
                            Topic Proficiency Breakdown
                        </Typography>
                        
                        <Divider sx={{ my: 3, bgcolor: 'rgba(255,255,255,0.1)' }} />
                        
                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
                            Topic Proficiency
                        </Typography>
                        
                        {/* DEBUGGING: Log the data used for the table */}
                        {console.log("Proficiency Breakdown Data:", proficiencyBreakdown)}
                        {console.log("Topics Covered in Quiz:", topicsCovered)}
                        {console.log("Is Proficiency Breakdown Object?", typeof proficiencyBreakdown === 'object' && proficiencyBreakdown !== null)}
                        {console.log("Is Topics Covered Array?", Array.isArray(topicsCovered))}
                        
                        {Object.keys(proficiencyBreakdown).length > 0 && Array.isArray(topicsCovered) ? (
                            <TableContainer component={Paper} sx={{ mb: 3, boxShadow: 2 }}>
                                <Table>
                                    <TableHead>
                                        <TableRow sx={{ bgcolor: 'primary.light' }}>
                                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Topic</TableCell>
                                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Proficiency</TableCell>
                                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Status</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {Object.entries(proficiencyBreakdown)
                                            .filter(([topic, _]) => topicsCovered.includes(topic))
                                            .map(([topic, proficiency]) => {
                                                const profValue = parseFloat(proficiency);
                                                let status = 'Beginner';
                                                let color = 'warning.main';
                                                
                                                if (profValue >= 80) {
                                                    status = 'Advanced';
                                                    color = 'success.main';
                                                } else if (profValue >= 40) {
                                                    status = 'Intermediate';
                                                    color = 'info.main';
                                                }
                                                
                                                return (
                                                    <TableRow key={topic} hover>
                                                        <TableCell>{topic}</TableCell>
                                                        <TableCell>
                                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                                <Box sx={{ width: '60%', mr: 1 }}>
                                                                    <LinearProgress 
                                                                        variant="determinate" 
                                                                        value={profValue} 
                                                                        sx={{ 
                                                                            height: 8, 
                                                                            borderRadius: 5,
                                                                            bgcolor: 'grey.200',
                                                                            '& .MuiLinearProgress-bar': {
                                                                                backgroundColor: color
                                                                            }
                                                                        }}
                                                                    />
                                                                </Box>
                                                                <Typography variant="body2" color="text.secondary">
                                                                    {proficiency}
                                                                </Typography>
                                                            </Box>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Chip 
                                                                size="small" 
                                                                label={status} 
                                                                sx={{ bgcolor: color, color: 'white' }} 
                                                            />
                                                        </TableCell>
                                                    </TableRow>
                                                );
                                            })}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        ) : (
                            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                                No topic proficiency data available for this quiz.
                            </Typography>
                        )}
                    </Paper>
                    
                    {/* Strengths & Weaknesses */}
                    <Grid container spacing={4} sx={{ mb: 4 }}>
                        {/* Strengths */}
                        <Grid item xs={12} md={6}>
                            <Paper 
                                elevation={3} 
                                sx={{ 
                                    p: 3, 
                                    height: '100%',
                                    borderRadius: 2,
                                    background: 'linear-gradient(145deg, #1a2035, #2a3045)',
                                    color: 'white',
                                    boxShadow: '0 10px 20px rgba(0,0,0,0.1)'
                                }}
                            >
                                <Typography variant="h5" gutterBottom sx={{ 
                                    fontWeight: 'medium', 
                                    color: 'white',
                                    display: 'flex',
                                    alignItems: 'center'
                                }}>
                                    <CheckCircle sx={{ mr: 1, color: '#4caf50' }} />
                                    Strengths
                                </Typography>
                                
                                <Divider sx={{ my: 2, bgcolor: 'rgba(255,255,255,0.1)' }} />
                                
                                <List>
                                    {strengths.map((strength, index) => (
                                        <ListItem key={index} sx={{ 
                                            bgcolor: 'rgba(255,255,255,0.05)',
                                            mb: 2,
                                            borderRadius: 2,
                                            py: 2
                                        }}>
                                            <ListItemIcon>
                                                <CheckCircle sx={{ color: '#4caf50', fontSize: 30 }} />
                                            </ListItemIcon>
                                            <ListItemText 
                                                primary={
                                                    <Typography variant="body1" fontWeight="medium" color="white">
                                                        {strength.topic} - {strength.proficiency}
                                                    </Typography>
                                                }
                                                secondary={
                                                    <>
                                                        <Typography variant="body2" color="rgba(255,255,255,0.7)" paragraph>
                                                            {strength.details}
                                                        </Typography>
                                                        {strength.description && (
                                                            <Typography 
                                                                variant="body2" 
                                                                color="rgba(255,255,255,0.9)"
                                                                sx={{ 
                                                                    mt: 1, 
                                                                    p: 1, 
                                                                    bgcolor: 'rgba(76,175,80,0.1)', 
                                                                    borderRadius: 1 
                                                                }}
                                                            >
                                                                {strength.description}
                                                            </Typography>
                                                        )}
                                                    </>
                                                }
                                            />
                                        </ListItem>
                                    ))}
                                </List>
                            </Paper>
                        </Grid>
                        
                        {/* Weaknesses */}
                        <Grid item xs={12} md={6}>
                            <Paper 
                                elevation={3} 
                                sx={{ 
                                    p: 3, 
                                    height: '100%',
                                    borderRadius: 2,
                                    background: 'linear-gradient(145deg, #1a2035, #2a3045)',
                                    color: 'white',
                                    boxShadow: '0 10px 20px rgba(0,0,0,0.1)'
                                }}
                            >
                                <Typography variant="h5" gutterBottom sx={{ 
                                    fontWeight: 'medium', 
                                    color: 'white',
                                    display: 'flex',
                                    alignItems: 'center'
                                }}>
                                    <Error sx={{ mr: 1, color: '#f44336' }} />
                                    Areas for Improvement
                                </Typography>
                                
                                <Divider sx={{ my: 2, bgcolor: 'rgba(255,255,255,0.1)' }} />
                                
                                <List>
                                    {weaknesses.map((weakness, index) => (
                                        <ListItem key={index} sx={{ 
                                            bgcolor: 'rgba(255,255,255,0.05)',
                                            mb: 2,
                                            borderRadius: 2,
                                            py: 2
                                        }}>
                                            <ListItemIcon>
                                                <Error sx={{ color: '#f44336', fontSize: 30 }} />
                                            </ListItemIcon>
                                            <ListItemText 
                                                primary={
                                                    <Typography variant="body1" fontWeight="medium" color="white">
                                                        {weakness.topic} - {weakness.proficiency}
                                                    </Typography>
                                                }
                                                secondary={
                                                    <>
                                                        <Typography variant="body2" color="rgba(255,255,255,0.7)" paragraph>
                                                            {weakness.details}
                                                        </Typography>
                                                        {weakness.description && (
                                                            <Typography 
                                                                variant="body2" 
                                                                color="rgba(255,255,255,0.9)"
                                                                sx={{ 
                                                                    mt: 1, 
                                                                    p: 1, 
                                                                    bgcolor: 'rgba(244,67,54,0.1)', 
                                                                    borderRadius: 1 
                                                                }}
                                                            >
                                                                {weakness.description}
                                                            </Typography>
                                                        )}
                                                    </>
                                                }
                                            />
                                        </ListItem>
                                    ))}
                                    
                                    {weaknesses.length === 0 && (
                                        <ListItem sx={{ bgcolor: 'rgba(255,255,255,0.05)', borderRadius: 2 }}>
                                            <ListItemIcon>
                                                <CheckCircle sx={{ color: '#4caf50' }} />
                                            </ListItemIcon>
                                            <ListItemText 
                                                primary="Great job!"
                                                secondary="You're performing well across all topics."
                                            />
                                        </ListItem>
                                    )}
                                </List>
                            </Paper>
                        </Grid>
                    </Grid>
                    
                    {/* Recommendations Section */}
                    <Grid item xs={12} md={4}>
                        <Card sx={{ height: '100%', borderRadius: 2, boxShadow: 3 }}>
                            <CardContent>
                                <Typography variant="h6" gutterBottom sx={{ 
                                    display: 'flex', 
                                    alignItems: 'center',
                                    fontWeight: 'bold',
                                    color: 'primary.dark'
                                }}>
                                    <Recommend sx={{ mr: 1 }} />
                                    Recommendations
                                </Typography>
                                
                                {recommendations.length > 0 ? (
                                    <List dense>
                                        {recommendations.map((rec, index) => (
                                            <ListItem key={index} sx={{ py: 1 }}>
                                                <ListItemIcon sx={{ minWidth: 36 }}>
                                                    <ArrowForward fontSize="small" color="primary" />
                                                </ListItemIcon>
                                                <ListItemText 
                                                    primary={rec.action || JSON.stringify(rec)}
                                                    primaryTypographyProps={{ 
                                                        variant: 'body2',
                                                        sx: { fontWeight: index === 0 ? 'medium' : 'normal' }
                                                    }}
                                                />
                                            </ListItem>
                                        ))}
                                    </List>
                                ) : (
                                    <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
                                        Complete more quizzes to receive personalized recommendations.
                                    </Typography>
                                )}
                                
                                {topicsCovered.length > 0 && (
                                    <Box sx={{ mt: 2 }}>
                                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                            Topics Covered:
                                        </Typography>
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                            {topicsCovered.map(topic => (
                                                <Chip 
                                                    key={topic} 
                                                    label={topic} 
                                                    size="small" 
                                                    color="primary" 
                                                    variant="outlined"
                                                    sx={{ fontSize: '0.7rem' }}
                                                />
                                            ))}
                                        </Box>
                                    </Box>
                                )}
                            </CardContent>
                        </Card>
                    </Grid>
                    
                    {/* Action Buttons */}
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 6 }}>
                        <Button 
                            variant="contained" 
                            color="primary" 
                            size="large"
                            onClick={onRetakeQuiz}
                            startIcon={<ArrowRightAlt />}
                            sx={{ 
                                borderRadius: 2,
                                px: 4,
                                py: 1.5,
                                boxShadow: 3,
                                '&:hover': {
                                    boxShadow: 6,
                                    transform: 'translateY(-2px)'
                                },
                                transition: 'all 0.2s'
                            }}
                        >
                            Retake Assessment
                        </Button>
                        
                        <Button 
                            variant="outlined" 
                            color="primary" 
                            size="large"
                            onClick={() => navigate('/')}
                            sx={{ 
                                borderRadius: 2,
                                px: 4,
                                py: 1.5,
                                '&:hover': {
                                    transform: 'translateY(-2px)'
                                },
                                transition: 'all 0.2s'
                            }}
                        >
                            Back to Home
                        </Button>
                    </Box>
                </motion.div>
            </Container>
        );
    } catch (error) {
        console.error("Error rendering QuizComplete:", error);
        return (
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Paper sx={{ p: 4, textAlign: 'center' }}>
                    <Typography variant="h4" color="error" gutterBottom>
                        Something went wrong
                    </Typography>
                    <Typography paragraph>
                        We couldn't display your quiz results. Please try again.
                    </Typography>
                    <Button 
                        variant="contained" 
                        color="primary" 
                        onClick={onRetakeQuiz}
                        sx={{ mt: 2 }}
                    >
                        Retake Quiz
                    </Button>
                </Paper>
            </Container>
        );
    }
};

export default QuizComplete; 