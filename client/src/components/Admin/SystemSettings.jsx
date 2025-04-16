import React, { useState, useEffect } from 'react';
import {
  Container, Typography, Paper, Box, Grid,
  Card, CardContent, TextField, Button,
  List, ListItem, ListItemText, ListItemIcon,
  ListItemSecondaryAction, Switch, Divider,
  FormControl, InputLabel, Select, MenuItem,
  Slider, Collapse, IconButton, Alert, Tooltip,
  Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import {
  Save as SaveIcon,
  Settings as SettingsIcon,
  BugReport as BugReportIcon,
  Security as SecurityIcon,
  Timer as TimerIcon,
  Build as BuildIcon,
  CloudUpload as CloudUploadIcon,
  Refresh as RefreshIcon,
  Api as ApiIcon,
  Email as EmailIcon,
  Tune as TuneIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import AuthRedirect from '../auth/AuthRedirect';

const SystemSettings = () => {
  // State for various settings
  const [loading, setLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [expandedSection, setExpandedSection] = useState("adaptive");
  const [apiKeyDialogOpen, setApiKeyDialogOpen] = useState(false);
  
  // System settings state
  const [settings, setSettings] = useState({
    adaptive: {
      difficultyRange: [0.3, 0.7],
      knowledgeThreshold: 0.75,
      minTopicCoverage: 5,
      adaptationSpeed: 0.5,
      enableProgressiveMode: true
    },
    quiz: {
      defaultTimeLimit: 15,
      showExplanations: true,
      questionsPerQuiz: 10,
      showHints: true,
      shuffleOptions: true
    },
    security: {
      sessionTimeout: 60,
      maxLoginAttempts: 5,
      enforcePasswordPolicy: true,
      enableTwoFactor: false,
      adminApprovalRequired: false
    },
    notification: {
      enableEmailNotifications: true,
      notifyOnQuizCompletion: true,
      emailDigestFrequency: 'weekly',
      adminAlerts: true
    },
    integration: {
      openaiApiKey: '****************************************',
      modelVersion: 'gpt-4',
      maxTokens: 2000
    }
  });

  // Mock for loading initial settings
  useEffect(() => {
    setLoading(true);
    // Simulate loading settings from backend
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  // Section expansion handlers
  const handleSectionToggle = (section) => {
    if (expandedSection === section) {
      setExpandedSection(null);
    } else {
      setExpandedSection(section);
    }
  };

  // Settings change handlers
  const handleSliderChange = (section, setting) => (event, newValue) => {
    setSettings({
      ...settings,
      [section]: {
        ...settings[section],
        [setting]: newValue
      }
    });
  };

  const handleSwitchChange = (section, setting) => (event) => {
    setSettings({
      ...settings,
      [section]: {
        ...settings[section],
        [setting]: event.target.checked
      }
    });
  };

  const handleInputChange = (section, setting) => (event) => {
    const value = event.target.type === 'number' ? 
      Number(event.target.value) : 
      event.target.value;

    setSettings({
      ...settings,
      [section]: {
        ...settings[section],
        [setting]: value
      }
    });
  };

  const handleSelectChange = (section, setting) => (event) => {
    setSettings({
      ...settings,
      [section]: {
        ...settings[section],
        [setting]: event.target.value
      }
    });
  };

  // API Key dialog handlers
  const handleOpenApiKeyDialog = () => {
    setApiKeyDialogOpen(true);
  };

  const handleCloseApiKeyDialog = () => {
    setApiKeyDialogOpen(false);
  };

  const handleUpdateApiKey = (newKey) => {
    setSettings({
      ...settings,
      integration: {
        ...settings.integration,
        openaiApiKey: newKey
      }
    });
    setApiKeyDialogOpen(false);
  };

  // Save settings handler
  const handleSaveSettings = () => {
    setLoading(true);
    // Simulate saving settings to backend
    setTimeout(() => {
      setLoading(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }, 1500);
  };

  // Reset settings handler
  const handleResetSettings = (section) => {
    const defaultSettings = {
      adaptive: {
        difficultyRange: [0.3, 0.7],
        knowledgeThreshold: 0.75,
        minTopicCoverage: 5,
        adaptationSpeed: 0.5,
        enableProgressiveMode: true
      },
      quiz: {
        defaultTimeLimit: 15,
        showExplanations: true,
        questionsPerQuiz: 10,
        showHints: true,
        shuffleOptions: true
      },
      security: {
        sessionTimeout: 60,
        maxLoginAttempts: 5,
        enforcePasswordPolicy: true,
        enableTwoFactor: false,
        adminApprovalRequired: false
      },
      notification: {
        enableEmailNotifications: true,
        notifyOnQuizCompletion: true,
        emailDigestFrequency: 'weekly',
        adminAlerts: true
      },
      integration: {
        openaiApiKey: settings.integration.openaiApiKey, // preserve API key
        modelVersion: 'gpt-4',
        maxTokens: 2000
      }
    };

    if (section) {
      setSettings({
        ...settings,
        [section]: defaultSettings[section]
      });
    } else {
      setSettings(defaultSettings);
    }
  };

  return (
    <>
      <AuthRedirect requireAdmin={true} />
      
      <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
          <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
              System Settings
            </Typography>
            <Button
              variant="contained"
              color="primary"
              startIcon={<SaveIcon />}
              onClick={handleSaveSettings}
              disabled={loading}
            >
              Save All Changes
            </Button>
          </Box>

          {saveSuccess && (
            <Alert severity="success" sx={{ mb: 3 }}>
              Settings saved successfully!
            </Alert>
          )}

          <Box sx={{ mb: 4 }}>
            <Typography variant="body1" color="text.secondary">
              Configure system-wide settings for the adaptive testing platform. Changes will affect all users.
            </Typography>
          </Box>

          {/* Adaptive Algorithm Settings */}
          <Card variant="outlined" sx={{ mb: 3 }}>
            <CardContent sx={{ p: 0 }}>
              <ListItem 
                button 
                onClick={() => handleSectionToggle('adaptive')}
                sx={{ 
                  bgcolor: expandedSection === 'adaptive' ? 'rgba(0, 0, 0, 0.04)' : 'transparent',
                  borderLeft: expandedSection === 'adaptive' ? '4px solid' : '4px solid transparent',
                  borderLeftColor: 'primary.main'
                }}
              >
                <ListItemIcon>
                  <TuneIcon color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="Adaptive Algorithm Settings" 
                  secondary="Configure how questions are selected based on user performance"
                />
                {expandedSection === 'adaptive' ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </ListItem>
              
              <Collapse in={expandedSection === 'adaptive'}>
                <Box sx={{ p: 3, pt: 0 }}>
                  <Divider sx={{ my: 2 }} />
                  
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Box sx={{ mb: 3 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                          <Typography variant="subtitle2">
                            Difficulty Range
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            [{settings.adaptive.difficultyRange[0]}, {settings.adaptive.difficultyRange[1]}]
                          </Typography>
                        </Box>
                        <Slider
                          value={settings.adaptive.difficultyRange}
                          onChange={handleSliderChange('adaptive', 'difficultyRange')}
                          valueLabelDisplay="auto"
                          min={0}
                          max={1}
                          step={0.05}
                          marks={[
                            { value: 0, label: 'Easy' },
                            { value: 0.5, label: 'Medium' },
                            { value: 1, label: 'Hard' }
                          ]}
                        />
                        <Typography variant="caption" color="text.secondary">
                          Controls the range of question difficulty presented to users
                        </Typography>
                      </Box>
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <Box sx={{ mb: 3 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                          <Typography variant="subtitle2">
                            Knowledge Threshold
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {settings.adaptive.knowledgeThreshold}
                          </Typography>
                        </Box>
                        <Slider
                          value={settings.adaptive.knowledgeThreshold}
                          onChange={handleSliderChange('adaptive', 'knowledgeThreshold')}
                          valueLabelDisplay="auto"
                          min={0.5}
                          max={0.95}
                          step={0.05}
                          marks={[
                            { value: 0.5, label: '50%' },
                            { value: 0.75, label: '75%' },
                            { value: 0.95, label: '95%' }
                          ]}
                        />
                        <Typography variant="caption" color="text.secondary">
                          Threshold for considering a topic mastered
                        </Typography>
                      </Box>
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <Box sx={{ mb: 3 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                          <Typography variant="subtitle2">
                            Minimum Topic Coverage
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {settings.adaptive.minTopicCoverage}
                          </Typography>
                        </Box>
                        <Slider
                          value={settings.adaptive.minTopicCoverage}
                          onChange={handleSliderChange('adaptive', 'minTopicCoverage')}
                          valueLabelDisplay="auto"
                          min={1}
                          max={10}
                          step={1}
                          marks={[
                            { value: 1, label: '1' },
                            { value: 5, label: '5' },
                            { value: 10, label: '10' }
                          ]}
                        />
                        <Typography variant="caption" color="text.secondary">
                          Minimum number of questions per topic before advancing
                        </Typography>
                      </Box>
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <Box sx={{ mb: 3 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                          <Typography variant="subtitle2">
                            Adaptation Speed
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {settings.adaptive.adaptationSpeed}
                          </Typography>
                        </Box>
                        <Slider
                          value={settings.adaptive.adaptationSpeed}
                          onChange={handleSliderChange('adaptive', 'adaptationSpeed')}
                          valueLabelDisplay="auto"
                          min={0.1}
                          max={1}
                          step={0.1}
                          marks={[
                            { value: 0.1, label: 'Slow' },
                            { value: 0.5, label: 'Medium' },
                            { value: 1, label: 'Fast' }
                          ]}
                        />
                        <Typography variant="caption" color="text.secondary">
                          How quickly the system adapts to user performance
                        </Typography>
                      </Box>
                    </Grid>
                    
                    <Grid item xs={12}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box>
                          <Typography variant="subtitle2">
                            Enable Progressive Mode
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Gradually increase difficulty as users improve
                          </Typography>
                        </Box>
                        <Switch
                          checked={settings.adaptive.enableProgressiveMode}
                          onChange={handleSwitchChange('adaptive', 'enableProgressiveMode')}
                          color="primary"
                        />
                      </Box>
                    </Grid>
                  </Grid>
                  
                  <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                    <Button 
                      variant="outlined" 
                      color="secondary" 
                      startIcon={<RefreshIcon />}
                      onClick={() => handleResetSettings('adaptive')}
                      sx={{ mr: 2 }}
                    >
                      Reset to Defaults
                    </Button>
                    <Button 
                      variant="contained"
                      color="primary"
                      startIcon={<SaveIcon />}
                      onClick={handleSaveSettings}
                    >
                      Save Changes
                    </Button>
                  </Box>
                </Box>
              </Collapse>
            </CardContent>
          </Card>

          {/* Quiz Settings */}
          <Card variant="outlined" sx={{ mb: 3 }}>
            <CardContent sx={{ p: 0 }}>
              <ListItem 
                button 
                onClick={() => handleSectionToggle('quiz')}
                sx={{ 
                  bgcolor: expandedSection === 'quiz' ? 'rgba(0, 0, 0, 0.04)' : 'transparent',
                  borderLeft: expandedSection === 'quiz' ? '4px solid' : '4px solid transparent',
                  borderLeftColor: 'primary.main'
                }}
              >
                <ListItemIcon>
                  <BuildIcon color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="Quiz Settings" 
                  secondary="Configure quiz behavior and display options"
                />
                {expandedSection === 'quiz' ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </ListItem>
              
              <Collapse in={expandedSection === 'quiz'}>
                <Box sx={{ p: 3, pt: 0 }}>
                  <Divider sx={{ my: 2 }} />
                  
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Default Time Limit (minutes)"
                        type="number"
                        value={settings.quiz.defaultTimeLimit}
                        onChange={handleInputChange('quiz', 'defaultTimeLimit')}
                        inputProps={{ min: 5, max: 60 }}
                        variant="outlined"
                        helperText="Time limit for each quiz in minutes (5-60)"
                      />
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Questions Per Quiz"
                        type="number"
                        value={settings.quiz.questionsPerQuiz}
                        onChange={handleInputChange('quiz', 'questionsPerQuiz')}
                        inputProps={{ min: 5, max: 30 }}
                        variant="outlined"
                        helperText="Number of questions in each quiz (5-30)"
                      />
                    </Grid>
                    
                    <Grid item xs={12} md={4}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box>
                          <Typography variant="subtitle2">
                            Show Explanations
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Display explanations after each answer
                          </Typography>
                        </Box>
                        <Switch
                          checked={settings.quiz.showExplanations}
                          onChange={handleSwitchChange('quiz', 'showExplanations')}
                          color="primary"
                        />
                      </Box>
                    </Grid>
                    
                    <Grid item xs={12} md={4}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box>
                          <Typography variant="subtitle2">
                            Show Hints
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Allow users to request hints during quizzes
                          </Typography>
                        </Box>
                        <Switch
                          checked={settings.quiz.showHints}
                          onChange={handleSwitchChange('quiz', 'showHints')}
                          color="primary"
                        />
                      </Box>
                    </Grid>
                    
                    <Grid item xs={12} md={4}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box>
                          <Typography variant="subtitle2">
                            Shuffle Options
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Randomize the order of answer options
                          </Typography>
                        </Box>
                        <Switch
                          checked={settings.quiz.shuffleOptions}
                          onChange={handleSwitchChange('quiz', 'shuffleOptions')}
                          color="primary"
                        />
                      </Box>
                    </Grid>
                  </Grid>
                  
                  <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                    <Button 
                      variant="outlined" 
                      color="secondary" 
                      startIcon={<RefreshIcon />}
                      onClick={() => handleResetSettings('quiz')}
                      sx={{ mr: 2 }}
                    >
                      Reset to Defaults
                    </Button>
                    <Button 
                      variant="contained"
                      color="primary"
                      startIcon={<SaveIcon />}
                      onClick={handleSaveSettings}
                    >
                      Save Changes
                    </Button>
                  </Box>
                </Box>
              </Collapse>
            </CardContent>
          </Card>

          {/* Security Settings */}
          <Card variant="outlined" sx={{ mb: 3 }}>
            <CardContent sx={{ p: 0 }}>
              <ListItem 
                button 
                onClick={() => handleSectionToggle('security')}
                sx={{ 
                  bgcolor: expandedSection === 'security' ? 'rgba(0, 0, 0, 0.04)' : 'transparent',
                  borderLeft: expandedSection === 'security' ? '4px solid' : '4px solid transparent',
                  borderLeftColor: 'primary.main'
                }}
              >
                <ListItemIcon>
                  <SecurityIcon color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="Security Settings" 
                  secondary="Configure security and authentication options"
                />
                {expandedSection === 'security' ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </ListItem>
              
              <Collapse in={expandedSection === 'security'}>
                <Box sx={{ p: 3, pt: 0 }}>
                  <Divider sx={{ my: 2 }} />
                  
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Session Timeout (minutes)"
                        type="number"
                        value={settings.security.sessionTimeout}
                        onChange={handleInputChange('security', 'sessionTimeout')}
                        inputProps={{ min: 15, max: 240 }}
                        variant="outlined"
                        helperText="Automatically log out users after inactivity (15-240 min)"
                      />
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Max Login Attempts"
                        type="number"
                        value={settings.security.maxLoginAttempts}
                        onChange={handleInputChange('security', 'maxLoginAttempts')}
                        inputProps={{ min: 3, max: 10 }}
                        variant="outlined"
                        helperText="Number of failed login attempts before temporary lockout"
                      />
                    </Grid>
                    
                    <Grid item xs={12} md={4}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box>
                          <Typography variant="subtitle2">
                            Enforce Password Policy
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Require strong passwords for all accounts
                          </Typography>
                        </Box>
                        <Switch
                          checked={settings.security.enforcePasswordPolicy}
                          onChange={handleSwitchChange('security', 'enforcePasswordPolicy')}
                          color="primary"
                        />
                      </Box>
                    </Grid>
                    
                    <Grid item xs={12} md={4}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box>
                          <Typography variant="subtitle2">
                            Enable Two-Factor Authentication
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Require 2FA for admin accounts
                          </Typography>
                        </Box>
                        <Switch
                          checked={settings.security.enableTwoFactor}
                          onChange={handleSwitchChange('security', 'enableTwoFactor')}
                          color="primary"
                        />
                      </Box>
                    </Grid>
                    
                    <Grid item xs={12} md={4}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box>
                          <Typography variant="subtitle2">
                            Admin Approval Required
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            New accounts require admin approval
                          </Typography>
                        </Box>
                        <Switch
                          checked={settings.security.adminApprovalRequired}
                          onChange={handleSwitchChange('security', 'adminApprovalRequired')}
                          color="primary"
                        />
                      </Box>
                    </Grid>
                  </Grid>
                  
                  <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                    <Button 
                      variant="outlined" 
                      color="secondary" 
                      startIcon={<RefreshIcon />}
                      onClick={() => handleResetSettings('security')}
                      sx={{ mr: 2 }}
                    >
                      Reset to Defaults
                    </Button>
                    <Button 
                      variant="contained"
                      color="primary"
                      startIcon={<SaveIcon />}
                      onClick={handleSaveSettings}
                    >
                      Save Changes
                    </Button>
                  </Box>
                </Box>
              </Collapse>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card variant="outlined" sx={{ mb: 3 }}>
            <CardContent sx={{ p: 0 }}>
              <ListItem 
                button 
                onClick={() => handleSectionToggle('notification')}
                sx={{ 
                  bgcolor: expandedSection === 'notification' ? 'rgba(0, 0, 0, 0.04)' : 'transparent',
                  borderLeft: expandedSection === 'notification' ? '4px solid' : '4px solid transparent',
                  borderLeftColor: 'primary.main'
                }}
              >
                <ListItemIcon>
                  <EmailIcon color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="Notification Settings" 
                  secondary="Configure email and system notifications"
                />
                {expandedSection === 'notification' ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </ListItem>
              
              <Collapse in={expandedSection === 'notification'}>
                <Box sx={{ p: 3, pt: 0 }}>
                  <Divider sx={{ my: 2 }} />
                  
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box>
                          <Typography variant="subtitle2">
                            Enable Email Notifications
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Send emails for important system events
                          </Typography>
                        </Box>
                        <Switch
                          checked={settings.notification.enableEmailNotifications}
                          onChange={handleSwitchChange('notification', 'enableEmailNotifications')}
                          color="primary"
                        />
                      </Box>
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box>
                          <Typography variant="subtitle2">
                            Notify on Quiz Completion
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Send email when users complete quizzes
                          </Typography>
                        </Box>
                        <Switch
                          checked={settings.notification.notifyOnQuizCompletion}
                          onChange={handleSwitchChange('notification', 'notifyOnQuizCompletion')}
                          color="primary"
                          disabled={!settings.notification.enableEmailNotifications}
                        />
                      </Box>
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth variant="outlined">
                        <InputLabel>Email Digest Frequency</InputLabel>
                        <Select
                          value={settings.notification.emailDigestFrequency}
                          onChange={handleSelectChange('notification', 'emailDigestFrequency')}
                          label="Email Digest Frequency"
                          disabled={!settings.notification.enableEmailNotifications}
                        >
                          <MenuItem value="daily">Daily</MenuItem>
                          <MenuItem value="weekly">Weekly</MenuItem>
                          <MenuItem value="monthly">Monthly</MenuItem>
                          <MenuItem value="never">Never</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box>
                          <Typography variant="subtitle2">
                            Admin Alerts
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Send alerts to admins for critical system events
                          </Typography>
                        </Box>
                        <Switch
                          checked={settings.notification.adminAlerts}
                          onChange={handleSwitchChange('notification', 'adminAlerts')}
                          color="primary"
                        />
                      </Box>
                    </Grid>
                  </Grid>
                  
                  <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                    <Button 
                      variant="outlined" 
                      color="secondary" 
                      startIcon={<RefreshIcon />}
                      onClick={() => handleResetSettings('notification')}
                      sx={{ mr: 2 }}
                    >
                      Reset to Defaults
                    </Button>
                    <Button 
                      variant="contained"
                      color="primary"
                      startIcon={<SaveIcon />}
                      onClick={handleSaveSettings}
                    >
                      Save Changes
                    </Button>
                  </Box>
                </Box>
              </Collapse>
            </CardContent>
          </Card>

          {/* API Integration Settings */}
          <Card variant="outlined" sx={{ mb: 3 }}>
            <CardContent sx={{ p: 0 }}>
              <ListItem 
                button 
                onClick={() => handleSectionToggle('integration')}
                sx={{ 
                  bgcolor: expandedSection === 'integration' ? 'rgba(0, 0, 0, 0.04)' : 'transparent',
                  borderLeft: expandedSection === 'integration' ? '4px solid' : '4px solid transparent',
                  borderLeftColor: 'primary.main'
                }}
              >
                <ListItemIcon>
                  <ApiIcon color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="API Integration Settings" 
                  secondary="Configure external API integrations including OpenAI"
                />
                {expandedSection === 'integration' ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </ListItem>
              
              <Collapse in={expandedSection === 'integration'}>
                <Box sx={{ p: 3, pt: 0 }}>
                  <Divider sx={{ my: 2 }} />
                  
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Typography variant="subtitle1" sx={{ mr: 1 }}>
                          OpenAI API Configuration
                        </Typography>
                        <Tooltip title="Used for generating quiz questions and providing explanations">
                          <InfoIcon fontSize="small" color="action" />
                        </Tooltip>
                      </Box>
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <Box sx={{ mb: 2 }}>
                        <TextField
                          fullWidth
                          label="OpenAI API Key"
                          type="password"
                          value={settings.integration.openaiApiKey}
                          InputProps={{
                            readOnly: true,
                            endAdornment: (
                              <Button 
                                variant="outlined" 
                                size="small" 
                                onClick={handleOpenApiKeyDialog}
                              >
                                Update
                              </Button>
                            )
                          }}
                          variant="outlined"
                          helperText="Your OpenAI API key is securely stored"
                        />
                      </Box>
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth variant="outlined">
                        <InputLabel>Model Version</InputLabel>
                        <Select
                          value={settings.integration.modelVersion}
                          onChange={handleSelectChange('integration', 'modelVersion')}
                          label="Model Version"
                        >
                          <MenuItem value="gpt-4">GPT-4</MenuItem>
                          <MenuItem value="gpt-3.5-turbo">GPT-3.5 Turbo</MenuItem>
                          <MenuItem value="gpt-3.5-turbo-16k">GPT-3.5 Turbo (16k)</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Max Tokens"
                        type="number"
                        value={settings.integration.maxTokens}
                        onChange={handleInputChange('integration', 'maxTokens')}
                        inputProps={{ min: 500, max: 8000 }}
                        variant="outlined"
                        helperText="Maximum tokens per API request (500-8000)"
                      />
                    </Grid>
                  </Grid>
                  
                  <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                    <Button 
                      variant="outlined" 
                      color="secondary" 
                      startIcon={<RefreshIcon />}
                      onClick={() => handleResetSettings('integration')}
                      sx={{ mr: 2 }}
                    >
                      Reset to Defaults
                    </Button>
                    <Button 
                      variant="contained"
                      color="primary"
                      startIcon={<SaveIcon />}
                      onClick={handleSaveSettings}
                    >
                      Save Changes
                    </Button>
                  </Box>
                </Box>
              </Collapse>
            </CardContent>
          </Card>

          {/* API Key Update Dialog */}
          <Dialog 
            open={apiKeyDialogOpen} 
            onClose={handleCloseApiKeyDialog}
            maxWidth="sm"
            fullWidth
          >
            <DialogTitle>Update OpenAI API Key</DialogTitle>
            <DialogContent>
              <TextField
                autoFocus
                margin="dense"
                label="New API Key"
                type="password"
                fullWidth
                variant="outlined"
                defaultValue=""
                placeholder="sk-..."
                sx={{ mt: 2 }}
              />
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                Your API key is stored securely and used only for generating quiz questions and explanations.
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseApiKeyDialog}>Cancel</Button>
              <Button 
                onClick={() => handleUpdateApiKey("sk-newKeyPlaceholder")} 
                variant="contained" 
                color="primary"
              >
                Save API Key
              </Button>
            </DialogActions>
          </Dialog>

          {/* Bottom save button */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              startIcon={<SaveIcon />}
              onClick={handleSaveSettings}
              disabled={loading}
            >
              Save All Changes
            </Button>
          </Box>
        </Paper>
      </Container>
    </>
  );
};

export default SystemSettings; 