import React from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Paper,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Link } from 'react-router-dom';
import {
  Dashboard as DashboardIcon,
  Code as CodeIcon,
  QuestionAnswer as QuestionIcon,
  People as PeopleIcon,
  Settings as SettingsIcon,
  Add as AddIcon
} from '@mui/icons-material';
import AuthRedirect from '../auth/AuthRedirect';

// Styled components
const FeatureCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[6],
  },
}));

const AdminDashboard = () => {
  // Include the redirect component
  return (
    <>
      <AuthRedirect requireAdmin={true} />
      
      <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main', display: 'flex', alignItems: 'center' }}>
              <DashboardIcon sx={{ mr: 1 }} />
              Admin Dashboard
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Manage and control the Adaptive Testing Platform
            </Typography>
          </Box>

          <Divider sx={{ mb: 4 }} />

          <Grid container spacing={3}>
            {adminFeatures.map((feature, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <FeatureCard>
                  <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                    <Box 
                      sx={{ 
                        p: 2, 
                        borderRadius: '50%', 
                        bgcolor: `${feature.color}10`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mb: 2
                      }}
                    >
                      {feature.icon}
                    </Box>
                    <Typography variant="h6" gutterBottom component="div">
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {feature.description}
                    </Typography>
                    <Box sx={{ mt: 'auto' }}>
                      <Button 
                        variant="outlined" 
                        component={Link} 
                        to={feature.path}
                        sx={{ mt: 2 }}
                      >
                        Access
                      </Button>
                    </Box>
                  </CardContent>
                </FeatureCard>
              </Grid>
            ))}
          </Grid>

          <Divider sx={{ my: 4 }} />

          <Box>
            <Typography variant="h6" gutterBottom>
              Quick Actions
            </Typography>
            <List component="nav">
              <ListItem button component={Link} to="/admin/question-generator">
                <ListItemIcon>
                  <AddIcon color="primary" />
                </ListItemIcon>
                <ListItemText primary="Generate New Questions" />
              </ListItem>
              <ListItem button component={Link} to="/">
                <ListItemIcon>
                  <CodeIcon color="secondary" />
                </ListItemIcon>
                <ListItemText primary="View Public Site" />
              </ListItem>
            </List>
          </Box>
        </Paper>
      </Container>
    </>
  );
};

const adminFeatures = [
  {
    title: 'Question Generator',
    description: 'Use AI to generate new Python questions for the quiz',
    icon: <AddIcon color="primary" fontSize="large" />,
    path: '/admin/question-generator',
    color: '#0A66C2'
  },
  {
    title: 'Quiz Management',
    description: 'Manage quiz settings, topics, and question banks',
    icon: <QuestionIcon color="secondary" fontSize="large" />,
    path: '/admin/quiz-management',
    color: '#9c27b0'
  },
  {
    title: 'User Analytics',
    description: 'View user performance data and learning analytics',
    icon: <PeopleIcon color="success" fontSize="large" />,
    path: '/admin/user-analytics',
    color: '#4caf50'
  },
  {
    title: 'System Settings',
    description: 'Configure system parameters and settings',
    icon: <SettingsIcon color="warning" fontSize="large" />,
    path: '/admin/settings',
    color: '#ff9800'
  }
];

export default AdminDashboard; 