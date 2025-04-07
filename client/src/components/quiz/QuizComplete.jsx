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
                
                {/* Recommendations */}
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
                        Personalized Recommendations
                    </Typography>
                    
                    <Divider sx={{ my: 3, bgcolor: 'rgba(255,255,255,0.1)' }} />
                    
                    <Grid container spacing={3}>
                        {recommendations.map((recommendation, index) => {
                            // Check if recommendation is a string (old format) or object (new format)
                            const isObject = typeof recommendation === 'object';
                            const topic = isObject ? recommendation.topic : 'General';
                            const action = isObject ? recommendation.action : recommendation;
                            const priority = isObject ? recommendation.priority : 'Medium';
                            const resources = isObject ? recommendation.resources : [];
                            
                            // Determine priority color
                            let priorityColor = '#ffeb3b'; // Medium - yellow
                            if (priority === 'High') priorityColor = '#f44336'; // High - red
                            if (priority === 'Low') priorityColor = '#4caf50'; // Low - green
                            
                            return (
                                <Grid item xs={12} md={6} key={index}>
                                    <Card sx={{ 
                                        bgcolor: 'rgba(255,255,255,0.05)', 
                                        height: '100%',
                                        borderLeft: `4px solid ${priorityColor}`,
                                        transition: 'transform 0.2s ease',
                                        '&:hover': {
                                            transform: 'translateY(-4px)',
                                            boxShadow: '0 6px 16px rgba(0,0,0,0.2)'
                                        }
                                    }}>
                                        <CardContent>
                                            {/* Priority Tag */}
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                                <Typography variant="subtitle1" fontWeight="bold" color="white">
                                                    {topic}
                                                </Typography>
                                                <Chip 
                                                    label={`${priority} Priority`} 
                                                    size="small"
                                                    sx={{ 
                                                        bgcolor: priorityColor, 
                                                        color: priority === 'Medium' ? 'black' : 'white',
                                                        fontWeight: 'medium',
                                                        fontSize: '0.75rem'
                                                    }} 
                                                />
                                            </Box>
                                            
                                            {/* Recommendation */}
                                            <Typography variant="body1" sx={{ 
                                                mb: 2,
                                                fontSize: '1rem',
                                                fontWeight: 'medium',
                                                color: 'white'
                                            }}>
                                                {action}
                                            </Typography>
                                            
                                            {/* Resources */}
                                            {resources && resources.length > 0 && (
                                                <>
                                                    <Typography variant="subtitle2" color="rgba(255,255,255,0.7)" gutterBottom sx={{ mt: 2 }}>
                                                        Suggested Resources:
                                                    </Typography>
                                                    <List dense disablePadding>
                                                        {resources.map((resource, i) => (
                                                            <ListItem key={i} disableGutters sx={{ 
                                                                py: 0.5,
                                                                display: 'flex',
                                                                alignItems: 'flex-start'
                                                            }}>
                                                                <ListItemIcon sx={{ minWidth: 28, mt: '2px' }}>
                                                                    <ArrowForward sx={{ 
                                                                        fontSize: '0.8rem',
                                                                        color: 'rgba(255,255,255,0.6)'
                                                                    }} />
                                                                </ListItemIcon>
                                                                <ListItemText 
                                                                    primary={resource}
                                                                    primaryTypographyProps={{
                                                                        variant: 'body2',
                                                                        color: 'rgba(255,255,255,0.8)',
                                                                        fontSize: '0.9rem'
                                                                    }}
                                                                />
                                                            </ListItem>
                                                        ))}
                                                    </List>
                                                </>
                                            )}
                                            
                                        </CardContent>
                                    </Card>
                                </Grid>
                            );
                        })}
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