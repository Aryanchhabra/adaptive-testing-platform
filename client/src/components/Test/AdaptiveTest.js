import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Radio, RadioGroup, FormControlLabel } from '@mui/material';

const AdaptiveTest = () => {
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [selectedAnswer, setSelectedAnswer] = useState('');
    const [currentDifficulty, setCurrentDifficulty] = useState(1);

    useEffect(() => {
        // Start test when component mounts
        startTest();
    }, []);

    const startTest = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/start-test', {
                method: 'POST'
            });
            const data = await response.json();
            setCurrentQuestion(data);
        } catch (error) {
            console.error('Error starting test:', error);
        }
    };

    const getNextQuestion = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/questions/${currentDifficulty}`);
            const questions = await response.json();
            if (questions.length > 0) {
                setCurrentQuestion(questions[0]);
            }
        } catch (error) {
            console.error('Error fetching question:', error);
        }
    };

    const handleSubmit = () => {
        if (!selectedAnswer) return;

        // Check if answer is correct
        const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
        
        // Adjust difficulty based on answer
        if (isCorrect) {
            setCurrentDifficulty(prev => Math.min(prev + 1, 5));
        } else {
            setCurrentDifficulty(prev => Math.max(prev - 1, 1));
        }

        // Get next question
        getNextQuestion();
        setSelectedAnswer('');
    };

    if (!currentQuestion) {
        return <Typography>Loading...</Typography>;
    }

    return (
        <Box sx={{ p: 3, maxWidth: 600, mx: 'auto' }}>
            <Typography variant="h6" gutterBottom>
                Question (Difficulty: {currentDifficulty})
            </Typography>
            
            <Typography paragraph>
                {currentQuestion.question}
            </Typography>

            <RadioGroup
                value={selectedAnswer}
                onChange={(e) => setSelectedAnswer(e.target.value)}
            >
                {currentQuestion.options.map((option, index) => (
                    <FormControlLabel
                        key={index}
                        value={option}
                        control={<Radio />}
                        label={option}
                    />
                ))}
            </RadioGroup>

            <Button
                variant="contained"
                onClick={handleSubmit}
                disabled={!selectedAnswer}
                sx={{ mt: 2 }}
            >
                Submit Answer
            </Button>
        </Box>
    );
};

export default AdaptiveTest; 