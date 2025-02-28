import React from 'react';
import { 
    Box, Typography, Button, Paper, 
    Container, Grid, CircularProgress, 
    List, ListItem, ListItemIcon, ListItemText, Divider,
    Card, CardContent, Chip, Avatar, Rating, Tooltip
} from '@mui/material';
import { 
    Check, Close, TrendingUp, TrendingDown, 
    Timer, School, Psychology, EmojiEvents,
    Speed, Insights, Lightbulb, BarChart
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { linkedinColors } from '../../theme';
import { PieChart, Pie, Cell, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar } from 'recharts';

const QuizComplete = ({ stats, analysis }) => {
    const navigate = useNavigate();
    
    if (!stats) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
                <CircularProgress />
            </Box>
        );
    }
    
    const accuracy = stats.accuracy || 0;
    const accuracyPercent = Math.round(accuracy * 100);
    
    // Prepare data for charts
    const pieData = [
        { name: 'Correct', value: Math.round(stats.current * accuracy), color: '#4caf50' },
        { name: 'Incorrect', value: stats.current - Math.round(stats.current * accuracy), color: '#f44336' }
    ];
    
    // Prepare radar data if knowledge state exists
    const radarData = analysis && analysis.topic_scores ? 
        Object.entries(analysis.topic_scores).map(([topic, score]) => ({
            subject: topic,
            A: score * 100,
            fullMark: 100
        })) : [];
    
    // Get performance level
    const getPerformanceLevel = (accuracy) => {
        if (accuracy >= 0.9) return { level: 'Expert', color: '#4caf50', icon: <EmojiEvents />, rating: 5 };
        if (accuracy >= 0.75) return { level: 'Advanced', color: '#8bc34a', icon: <TrendingUp />, rating: 4 };
        if (accuracy >= 0.6) return { level: 'Intermediate', color: '#ffeb3b', icon: <School />, rating: 3 };
        if (accuracy >= 0.4) return { level: 'Basic', color: '#ff9800', icon: <Psychology />, rating: 2 };
        return { level: 'Novice', color: '#f44336', icon: <Lightbulb />, rating: 1 };
    };
    
    const performanceInfo = getPerformanceLevel(accuracy);
    
    return (
        <Container maxWidth="lg">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <Typography 
                    variant="h2" 
                    component="h1" 
                    gutterBottom 
                    sx={{ 
                        color: linkedinColors.primary,
                        fontWeight: 'bold',
                        mb: 4,
                        textAlign: 'center'
                    }}
                >
                    Quiz Completed! <span role="img" aria-label="celebration">🎉</span>
                </Typography>
                
                {/* Performance Summary Card */}
                <Paper 
                    elevation={3} 
                    sx={{ 
                        p: 4, 
                        mb: 4, 
                        borderRadius: 2,
                        background: 'linear-gradient(145deg, #1a2035, #2a3045)',
                        color: 'white'
                    }}
                >
                    <Typography variant="h4" gutterBottom sx={{ fontWeight: 'medium', color: 'white' }}>
                        Performance Summary
                    </Typography>
                    
                    <Grid container spacing={3} alignItems="center">
                        <Grid item xs={12} md={6}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <Chip 
                                    icon={performanceInfo.icon} 
                                    label={`${performanceInfo.level} Level`} 
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
                                    Questions Answered: {stats.current}
                                </Typography>
                                <Typography variant="h6" gutterBottom>
                                    Correct Answers: {Math.round(stats.current * accuracy)}
                                </Typography>
                                <Typography variant="h6" gutterBottom>
                                    Accuracy: {accuracyPercent}%
                                </Typography>
                                
                                {analysis && analysis.response_time_analysis && (
                                    <Typography variant="h6" gutterBottom>
                                        Average Response Time: {Math.round(analysis.response_time_analysis.average * 10) / 10}s
                                    </Typography>
                                )}
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
                
                {/* Analysis Section */}
                {analysis && (
                    <Paper 
                        elevation={3} 
                        sx={{ 
                            p: 4, 
                            mb: 4, 
                            borderRadius: 2,
                            background: 'linear-gradient(145deg, #1a2035, #2a3045)',
                            color: 'white'
                        }}
                    >
                        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'medium', color: 'white' }}>
                            <Insights sx={{ mr: 1, verticalAlign: 'middle' }} />
                            Detailed Analysis
                        </Typography>
                        
                        <Divider sx={{ my: 3 }} />
                        
                        <Grid container spacing={4}>
                            {/* Left Column */}
                            <Grid item xs={12} md={6}>
                                {/* Overall Assessment */}
                                <Card sx={{ mb: 3, boxShadow: 3, bgcolor: 'rgba(255,255,255,0.1)' }}>
                                    <CardContent>
                                        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                                            <School sx={{ mr: 1, color: linkedinColors.primary }} />
                                            Overall Assessment
                                        </Typography>
                                        <Typography variant="body1" sx={{ fontStyle: 'italic', color: 'text.secondary' }}>
                                            {analysis.overall_assessment}
                                        </Typography>
                                    </CardContent>
                                </Card>
                                
                                {/* Strengths */}
                                {analysis.strengths && analysis.strengths.length > 0 && (
                                    <Card sx={{ mb: 3, boxShadow: 3, bgcolor: 'rgba(255,255,255,0.1)' }}>
                                        <CardContent>
                                            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                                                <TrendingUp sx={{ mr: 1, color: 'success.main' }} />
                                                Strengths
                                            </Typography>
                                            <List dense>
                                                {analysis.strengths.map((strength, index) => (
                                                    <ListItem key={index}>
                                                        <ListItemIcon>
                                                            <Check sx={{ color: 'success.main' }} />
                                                        </ListItemIcon>
                                                        <ListItemText 
                                                            primary={strength} 
                                                            primaryTypographyProps={{ fontWeight: 'medium' }}
                                                        />
                                                    </ListItem>
                                                ))}
                                            </List>
                                        </CardContent>
                                    </Card>
                                )}
                                
                                {/* Areas to Improve */}
                                {analysis.weaknesses && analysis.weaknesses.length > 0 && (
                                    <Card sx={{ mb: 3, boxShadow: 3, bgcolor: 'rgba(255,255,255,0.1)' }}>
                                        <CardContent>
                                            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                                                <TrendingDown sx={{ mr: 1, color: 'error.main' }} />
                                                Areas to Improve
                                            </Typography>
                                            <List dense>
                                                {analysis.weaknesses.map((weakness, index) => (
                                                    <ListItem key={index}>
                                                        <ListItemIcon>
                                                            <Close sx={{ color: 'error.main' }} />
                                                        </ListItemIcon>
                                                        <ListItemText 
                                                            primary={weakness}
                                                            primaryTypographyProps={{ fontWeight: 'medium' }}
                                                        />
                                                    </ListItem>
                                                ))}
                                            </List>
                                        </CardContent>
                                    </Card>
                                )}
                            </Grid>
                            
                            {/* Right Column */}
                            <Grid item xs={12} md={6}>
                                {/* Topic Performance Radar Chart */}
                                {radarData.length > 0 && (
                                    <Card sx={{ mb: 3, boxShadow: 3, bgcolor: 'rgba(255,255,255,0.1)' }}>
                                        <CardContent>
                                            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                                                <BarChart sx={{ mr: 1, color: linkedinColors.primary }} />
                                                Topic Performance
                                            </Typography>
                                            <Box sx={{ height: 300 }}>
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <RadarChart outerRadius={90} data={radarData}>
                                                        <PolarGrid />
                                                        <PolarAngleAxis dataKey="subject" />
                                                        <Radar
                                                            name="Performance"
                                                            dataKey="A"
                                                            stroke={linkedinColors.primary}
                                                            fill={linkedinColors.primary}
                                                            fillOpacity={0.6}
                                                        />
                                                    </RadarChart>
                                                </ResponsiveContainer>
                                            </Box>
                                        </CardContent>
                                    </Card>
                                )}
                                
                                {/* Response Time Analysis */}
                                {analysis.response_time_analysis && (
                                    <Card sx={{ mb: 3, boxShadow: 3, bgcolor: 'rgba(255,255,255,0.1)' }}>
                                        <CardContent>
                                            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                                                <Speed sx={{ mr: 1, color: linkedinColors.primary }} />
                                                Response Time Analysis
                                            </Typography>
                                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                                <Typography variant="body1" sx={{ mr: 1 }}>
                                                    Average: {Math.round(analysis.response_time_analysis.average * 10) / 10} seconds
                                                </Typography>
                                                <Tooltip title={analysis.response_time_analysis.average < 10 ? "Fast response time!" : "Consider practicing to improve speed"}>
                                                    <Chip 
                                                        label={analysis.response_time_analysis.average < 10 ? "Fast" : "Moderate"} 
                                                        color={analysis.response_time_analysis.average < 10 ? "success" : "warning"}
                                                        size="small"
                                                    />
                                                </Tooltip>
                                            </Box>
                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                <Typography variant="body1" sx={{ mr: 1 }}>
                                                    Consistency: {Math.round(analysis.response_time_analysis.consistency * 100)}%
                                                </Typography>
                                                <Tooltip title={analysis.response_time_analysis.consistency > 0.7 ? "Consistent timing across questions" : "Your timing varies between questions"}>
                                                    <Chip 
                                                        label={analysis.response_time_analysis.consistency > 0.7 ? "Consistent" : "Variable"} 
                                                        color={analysis.response_time_analysis.consistency > 0.7 ? "success" : "info"}
                                                        size="small"
                                                    />
                                                </Tooltip>
                                            </Box>
                                        </CardContent>
                                    </Card>
                                )}
                                
                                {/* Recommendations */}
                                {analysis.recommendations && analysis.recommendations.length > 0 && (
                                    <Card sx={{ boxShadow: 3, bgcolor: 'rgba(255,255,255,0.1)' }}>
                                        <CardContent>
                                            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                                                <Lightbulb sx={{ mr: 1, color: 'warning.main' }} />
                                                Recommendations
                                            </Typography>
                                            <List dense>
                                                {analysis.recommendations.map((rec, index) => (
                                                    <ListItem key={index}>
                                                        <ListItemIcon>
                                                            <Avatar 
                                                                sx={{ 
                                                                    bgcolor: linkedinColors.primary,
                                                                    width: 24,
                                                                    height: 24,
                                                                    fontSize: '0.8rem'
                                                                }}
                                                            >
                                                                {index + 1}
                                                            </Avatar>
                                                        </ListItemIcon>
                                                        <ListItemText primary={rec} />
                                                    </ListItem>
                                                ))}
                                            </List>
                                        </CardContent>
                                    </Card>
                                )}
                            </Grid>
                        </Grid>
                    </Paper>
                )}
                
                {/* Action Buttons */}
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 4, mb: 6 }}>
                    <Button 
                        variant="contained" 
                        color="primary" 
                        size="large"
                        onClick={() => navigate('/quiz')}
                        startIcon={<School />}
                        sx={{ px: 4, py: 1.5 }}
                    >
                        Take Another Quiz
                    </Button>
                    <Button 
                        variant="outlined" 
                        color="primary" 
                        size="large"
                        onClick={() => navigate('/')}
                        sx={{ px: 4, py: 1.5 }}
                    >
                        Back to Home
                    </Button>
                </Box>
            </motion.div>
        </Container>
    );
};

export default QuizComplete; 