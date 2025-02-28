from openai import AsyncOpenAI
import numpy as np
from typing import List, Dict, Any
import os
from dotenv import load_dotenv

load_dotenv()

class AIService:
    def __init__(self):
        self.client = AsyncOpenAI(api_key=os.getenv('OPENAI_API_KEY'))
        
    async def generate_question(self, topic: str, difficulty: int, previous_questions: List[str]) -> Dict:
        """Generate new questions using GPT-4"""
        prompt = f"""
        Generate a multiple-choice question about {topic} at difficulty level {difficulty}/10.
        Format: JSON with fields:
        - question: the question text
        - options: array of 4 options
        - correct_answer: index of correct option (0-3)
        - explanation: detailed explanation of the answer
        - concept_id: main concept being tested
        - difficulty: {difficulty}
        - category: subject area
        """
        
        response = await self.client.chat.completions.create(
            model="gpt-4",
            messages=[{"role": "system", "content": prompt}],
            temperature=0.7
        )
        
        return response.choices[0].message.content

    async def analyze_performance(self, responses: List[Dict]) -> Dict:
        """Analyze student performance using GPT-4"""
        performance_data = str(responses)  # Convert to string format
        
        prompt = f"""
        Analyze this student's test performance data: {performance_data}
        Provide:
        1. Strengths and weaknesses
        2. Knowledge gaps
        3. Learning patterns
        4. Recommended focus areas
        Format as JSON with these fields.
        """
        
        response = await self.client.chat.completions.create(
            model="gpt-4",
            messages=[{"role": "system", "content": prompt}],
            temperature=0.3
        )
        
        return response.choices[0].message.content

    async def generate_recommendations(self, analysis: Dict, difficulty_level: float) -> Dict:
        """Generate personalized learning recommendations"""
        prompt = f"""
        Based on this analysis: {str(analysis)}
        And current difficulty level: {difficulty_level}
        Provide:
        1. Specific topics to study
        2. Learning resources (books, videos, websites)
        3. Practice exercises
        4. Study schedule suggestion
        Format as JSON with these fields.
        """
        
        response = await self.client.chat.completions.create(
            model="gpt-4",
            messages=[{"role": "system", "content": prompt}],
            temperature=0.5
        )
        
        return response.choices[0].message.content

    async def generate_concept_map(self, topic: str) -> Dict:
        """Generate a concept map for a topic"""
        prompt = f"""
        Create a detailed concept map for {topic} in JSON format.
        Include:
        1. Main concepts
        2. Prerequisites for each concept
        3. Related topics
        4. Learning objectives
        5. Difficulty levels
        Format as a structured JSON object.
        """
        
        response = await self.client.chat.completions.create(
            model="gpt-4",
            messages=[{"role": "system", "content": prompt}],
            temperature=0.5
        )
        
        return response.choices[0].message.content

    async def generate_hints(self, question: str) -> list:
        prompt = f"""
        For this question: "{question}"
        Generate 3 progressive hints:
        1. A subtle hint that points in the right direction
        2. A more specific hint about the concept
        3. A strong hint that almost gives away the answer
        
        Format as a JSON array of strings.
        """
        
        response = await self.client.chat.completions.create(
            model="gpt-4",
            messages=[{"role": "system", "content": prompt}],
            temperature=0.7
        )
        
        return response.choices[0].message.content

    async def generate_explanation(self, question: str, user_answer: str, 
                                 correct_answer: str, is_correct: bool) -> str:
        prompt = f"""
        Question: {question}
        User's answer: {user_answer}
        Correct answer: {correct_answer}
        Result: {"Correct" if is_correct else "Incorrect"}
        
        Provide:
        1. Explanation of why the answer is {"correct" if is_correct else "incorrect"}
        2. Key concept being tested
        3. Common misconceptions
        4. Additional learning resources
        
        Format as a detailed but concise explanation.
        """
        
        response = await self.client.chat.completions.create(
            model="gpt-4",
            messages=[{"role": "system", "content": prompt}],
            temperature=0.7
        )
        
        return response.choices[0].message.content

    async def generate_study_plan(self, 
                                analysis: Dict, 
                                target_topics: List[str],
                                time_available: int) -> Dict:
        """Generate personalized study plan"""
        prompt = f"""
        Based on:
        - Performance analysis: {str(analysis)}
        - Target topics: {', '.join(target_topics)}
        - Available time: {time_available} hours
        
        Create a detailed study plan including:
        1. Daily schedule
        2. Topic priorities
        3. Recommended resources
        4. Practice exercises
        5. Milestones and checkpoints
        Format as JSON.
        """
        
        response = await self.client.chat.completions.create(
            model="gpt-4",
            messages=[{"role": "system", "content": prompt}],
            temperature=0.6
        )
        
        return response.choices[0].message.content

    async def generate_final_analysis(self, knowledge_state: dict, 
                                    total_questions: int,
                                    performance_history: list) -> dict:
        prompt = f"""
        Based on the following test performance:
        - Knowledge state by topic: {knowledge_state}
        - Total questions: {total_questions}
        - Performance history: {performance_history}
        
        Generate a detailed analysis including:
        1. Overall performance summary
        2. Strengths and weaknesses by topic
        3. Specific concepts that need attention
        4. Personalized learning recommendations
        5. Suggested resources for improvement
        6. Estimated time needed for improvement
        7. Practice exercises for weak areas
        
        Format as a structured JSON with these sections.
        """
        
        response = await self.client.chat.completions.create(
            model="gpt-4",
            messages=[{"role": "system", "content": prompt}],
            temperature=0.7
        )
        
        return response.choices[0].message.content 