import React from 'react';
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
    
    if (!stats || !analysis) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
                <CircularProgress />
                <Typography sx={{ ml: 2 }}>Generating your personalized analysis...</Typography>
            </Box>
        );
    }
    
    // Extract data from analysis
    const accuracy = analysis.accuracy || 0;
    const accuracyPercent = Math.round(accuracy * 100);
    const overallProficiency = analysis.overall_proficiency || '0%';
    const performanceLevel = analysis.performance_level || 'Beginner';
    const strengths = analysis.strengths || [];
    const weaknesses = analysis.weaknesses || [];
    const recommendations = analysis.recommendations || [];
    const insights = analysis.performance_insights || [];
    const proficiencyBreakdown = analysis.proficiency_breakdown || {};
    
    // Prepare data for charts
    const pieData = [
        { name: 'Correct', value: analysis.correct_answers || 0, color: '#4caf50' },
        { name: 'Incorrect', value: (analysis.total_questions || 0) - (analysis.correct_answers || 0), color: '#f44336' }
    ];
    
    // Prepare radar data if proficiency breakdown exists
    const radarData = Object.entries(proficiencyBreakdown).map(([topic, score]) => ({
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
                    
                    <Grid container spacing={4}>
                        <Grid item xs={12} md={6}>
                            <TableContainer component={Paper} sx={{ bgcolor: 'rgba(255,255,255,0.1)' }}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Topic</TableCell>
                                            <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Proficiency</TableCell>
                                            <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Level</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {Object.entries(proficiencyBreakdown).map(([topic, score]) => {
                                            const profValue = parseFloat(score.replace('%', ''));
                                            let level = 'Beginner';
                                            let color = '#ff9800';
                                            
                                            if (profValue >= 80) {
                                                level = 'Expert';
                                                color = '#4caf50';
                                            } else if (profValue >= 60) {
                                                level = 'Advanced';
                                                color = '#8bc34a';
                                            } else if (profValue >= 40) {
                                                level = 'Intermediate';
                                                color = '#ffeb3b';
                                            }
                                            
                                            return (
                                                <TableRow key={topic}>
                                                    <TableCell sx={{ color: 'white' }}>{topic}</TableCell>
                                                    <TableCell sx={{ color: 'white' }}>
                                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                            <Box sx={{ width: 100, mr: 1 }}>
                                                                <LinearProgress 
                                                                    variant="determinate" 
                                                                    value={profValue} 
                                                                    sx={{ 
                                                                        height: 8, 
                                                                        borderRadius: 4,
                                                                        bgcolor: 'rgba(255,255,255,0.1)',
                                                                        '& .MuiLinearProgress-bar': {
                                                                            background: `linear-gradient(90deg, ${color}99, ${color})`
                                                                        }
                                                                    }}
                                                                />
                                                            </Box>
                                                            <Typography>{score}</Typography>
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell sx={{ color: 'white' }}>
                                                        <Chip 
                                                            label={level} 
                                                            size="small"
                                                            sx={{ 
                                                                bgcolor: color, 
                                                                color: 'white',
                                                                fontWeight: 'medium'
                                                            }} 
                                                        />
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Grid>
                        
                        <Grid item xs={12} md={6}>
                            {radarData.length > 0 && (
                                <Box sx={{ height: 300, bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 2, p: 2 }}>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <RadarChart outerRadius={90} data={radarData}>
                                            <PolarGrid stroke="rgba(255,255,255,0.3)" />
                                            <PolarAngleAxis dataKey="subject" tick={{ fill: 'white' }} />
                                            <Radar name="Proficiency" dataKey="A" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                                        </RadarChart>
                                    </ResponsiveContainer>
                                </Box>
                            )}
                        </Grid>
                    </Grid>
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
                                    <ListItem 
                                        key={index} 
                                        sx={{ 
                                            bgcolor: 'rgba(76, 175, 80, 0.1)', 
                                            mb: 2, 
                                            borderRadius: 2,
                                            border: '1px solid rgba(76, 175, 80, 0.3)'
                                        }}
                                    >
                                        <ListItemIcon>
                                            <Avatar sx={{ bgcolor: '#4caf50' }}>
                                                <Check />
                                            </Avatar>
                                        </ListItemIcon>
                                        <ListItemText 
                                            primary={
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                                    <Typography variant="subtitle1" fontWeight="medium">
                                                        {strength.topic}
                                                    </Typography>
                                                    <Chip 
                                                        label={strength.proficiency} 
                                                        size="small"
                                                        sx={{ bgcolor: '#4caf50', color: 'white' }}
                                                    />
                                                </Box>
                                            }
                                            secondary={
                                                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mt: 0.5 }}>
                                                    {strength.details}
                                                </Typography>
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
                                    <ListItem 
                                        key={index} 
                                        sx={{ 
                                            bgcolor: 'rgba(244, 67, 54, 0.1)', 
                                            mb: 2, 
                                            borderRadius: 2,
                                            border: '1px solid rgba(244, 67, 54, 0.3)'
                                        }}
                                    >
                                        <ListItemIcon>
                                            <Avatar sx={{ bgcolor: '#f44336' }}>
                                                <TrendingUp />
                                            </Avatar>
                                        </ListItemIcon>
                                        <ListItemText 
                                            primary={
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                                    <Typography variant="subtitle1" fontWeight="medium">
                                                        {weakness.topic}
                                                    </Typography>
                                                    <Chip 
                                                        label={weakness.proficiency} 
                                                        size="small"
                                                        sx={{ bgcolor: '#f44336', color: 'white' }}
                                                    />
                                                </Box>
                                            }
                                            secondary={
                                                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mt: 0.5 }}>
                                                    {weakness.details}
                                                </Typography>
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
                
                {/* Recommendations & Insights */}
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
                    <Typography variant="h4" gutterBottom sx={{ 
                        fontWeight: 'medium', 
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center'
                    }}>
                        <Recommend sx={{ mr: 1 }} />
                        Recommendations & Insights
                    </Typography>
                    
                    <Divider sx={{ my: 3, bgcolor: 'rgba(255,255,255,0.1)' }} />
                    
                    <Grid container spacing={4}>
                        {/* Recommendations */}
                        <Grid item xs={12} md={6}>
                            <Typography variant="h6" gutterBottom sx={{ color: '#8bc34a' }}>
                                Recommended Next Steps
                            </Typography>
                            
                            <List>
                                {recommendations.map((recommendation, index) => (
                                    <ListItem 
                                        key={index} 
                                        sx={{ 
                                            bgcolor: 'rgba(255,255,255,0.05)', 
                                            mb: 2, 
                                            borderRadius: 2 
                                        }}
                                    >
                                        <ListItemIcon>
                                            <Avatar sx={{ bgcolor: '#8bc34a' }}>
                                                {index + 1}
                                            </Avatar>
                                        </ListItemIcon>
                                        <ListItemText primary={recommendation} />
                                    </ListItem>
                                ))}
                            </List>
                        </Grid>
                        
                        {/* Insights */}
                        <Grid item xs={12} md={6}>
                            <Typography variant="h6" gutterBottom sx={{ color: '#2196f3' }}>
                                Performance Insights
                            </Typography>
                            
                            <List>
                                {insights.map((insight, index) => (
                                    <ListItem 
                                        key={index} 
                                        sx={{ 
                                            bgcolor: 'rgba(255,255,255,0.05)', 
                                            mb: 2, 
                                            borderRadius: 2 
                                        }}
                                    >
                                        <ListItemIcon>
                                            <Avatar sx={{ bgcolor: '#2196f3' }}>
                                                <Info />
                                            </Avatar>
                                        </ListItemIcon>
                                        <ListItemText primary={insight} />
                                    </ListItem>
                                ))}
                            </List>
                        </Grid>
                    </Grid>
                </Paper>
                
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
};

export default QuizComplete; 