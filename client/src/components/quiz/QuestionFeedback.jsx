import React from 'react';
import { 
  Box, Typography, Paper, Collapse, 
  List, ListItem, ListItemIcon, ListItemText 
} from '@mui/material';
import { 
  CheckCircle, Cancel, Info, 
  TrendingUp, School 
} from '@mui/icons-material';

function QuestionFeedback({ feedback, isCorrect }) {
  return (
    <Collapse in={Boolean(feedback)}>
      <Paper 
        sx={{ 
          p: 3, 
          mt: 2,
          bgcolor: isCorrect ? 'success.dark' : 'error.dark',
          color: 'white'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          {isCorrect ? (
            <CheckCircle sx={{ mr: 1 }} />
          ) : (
            <Cancel sx={{ mr: 1 }} />
          )}
          <Typography variant="h6">
            {isCorrect ? 'Correct!' : 'Not quite right'}
          </Typography>
        </Box>

        <List>
          <ListItem>
            <ListItemIcon>
              <Info sx={{ color: 'white' }} />
            </ListItemIcon>
            <ListItemText 
              primary={feedback.explanation}
              sx={{ color: 'white' }}
            />
          </ListItem>

          <ListItem>
            <ListItemIcon>
              <TrendingUp sx={{ color: 'white' }} />
            </ListItemIcon>
            <ListItemText 
              primary="Related Concepts"
              secondary={feedback.relatedConcepts.join(', ')}
              sx={{ 
                '& .MuiListItemText-secondary': { 
                  color: 'rgba(255,255,255,0.7)' 
                } 
              }}
            />
          </ListItem>

          <ListItem>
            <ListItemIcon>
              <School sx={{ color: 'white' }} />
            </ListItemIcon>
            <ListItemText 
              primary="Practice Suggestion"
              secondary={feedback.practiceSuggestion}
              sx={{ 
                '& .MuiListItemText-secondary': { 
                  color: 'rgba(255,255,255,0.7)' 
                } 
              }}
            />
          </ListItem>
        </List>
      </Paper>
    </Collapse>
  );
}

export default QuestionFeedback; 