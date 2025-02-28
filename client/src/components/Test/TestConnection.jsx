import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Button, CircularProgress } from '@mui/material';
import { Check, Error } from '@mui/icons-material';

function TestConnection() {
    const [status, setStatus] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const testConnection = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('http://localhost:5000/api/test-connection');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            console.log("Connection test response:", data); // Debug log
            setStatus(data);
            
            if (data.status === 'error') {
                setError(data.message);
            }
        } catch (err) {
            console.error("Connection test error:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const loadQuestions = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('http://localhost:5000/api/load-questions', {
                method: 'POST'
            });
            const data = await response.json();
            if (data.error) {
                throw new Error(data.error);
            }
            alert(`Successfully loaded ${data.questions_loaded} questions!`);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ p: 3 }}>
            <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                    System Status
                </Typography>
                
                <Button 
                    variant="contained" 
                    onClick={testConnection}
                    disabled={loading}
                    sx={{ mr: 2 }}
                >
                    Test Connection
                </Button>

                <Button 
                    variant="contained" 
                    onClick={loadQuestions}
                    disabled={loading}
                >
                    Load Questions
                </Button>

                {loading && <CircularProgress size={24} sx={{ ml: 2 }} />}

                {error && (
                    <Typography color="error" sx={{ mt: 2 }}>
                        Error: {error}
                    </Typography>
                )}

                {status && (
                    <Box sx={{ mt: 2 }}>
                        <Typography>
                            Firebase Connection: {' '}
                            {status.firebase_connection ? 
                                <Check color="success" /> : 
                                <Error color="error" />}
                        </Typography>
                        <Typography>
                            CSV Found: {' '}
                            {status.csv_found ? 
                                <Check color="success" /> : 
                                <Error color="error" />}
                        </Typography>
                    </Box>
                )}
            </Paper>
        </Box>
    );
}

export default TestConnection; 