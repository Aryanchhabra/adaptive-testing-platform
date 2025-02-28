import os
import json
import openai
from typing import List, Dict, Optional
from dotenv import load_dotenv
from pathlib import Path
from utils.question_validator import validate_question

# Load environment variables from root directory
root_dir = Path(__file__).resolve().parent.parent.parent
dotenv_path = root_dir / '.env'
load_dotenv(dotenv_path=dotenv_path)

class AIQuestionGenerator:
    def __init__(self):
        openai.api_key = os.getenv('OPENAI_API_KEY')
        self.daily_limit = 20  # Set a reasonable limit for free tier
        self.questions_generated_today = 0
        self.last_reset_date = None
        
    def generate_questions(self, topic: str, difficulty: int, count: int = 5) -> List[Dict]:
        """Generate a batch of questions using OpenAI API"""
        try:
            # Create a prompt for generating multiple questions at once
            prompt = self._create_batch_prompt(topic, difficulty, count)
            
            # Make API call
            response = openai.ChatCompletion.create(
                model="gpt-3.5-turbo",  # Use the cheaper model
                messages=[
                    {"role": "system", "content": "You are an expert Python programming teacher."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.7,
                max_tokens=1500  # Increased for multiple questions
            )
            
            # Extract and parse the response
            response_text = response.choices[0].message.content
            questions = self._parse_questions(response_text)
            
            # Add metadata to each question
            for question in questions:
                question['topic'] = topic
                question['difficulty'] = difficulty
                
            return questions
            
        except Exception as e:
            print(f"Error generating questions: {e}")
            return []
        
    def _create_batch_prompt(self, topic: str, difficulty: int, count: int) -> str:
        """Create a prompt for generating multiple questions at once"""
        difficulty_desc = ["beginner", "intermediate", "advanced"][min(difficulty-1, 2)]
        
        return f"""
        Create {count} multiple-choice Python programming questions about {topic} at {difficulty_desc} level.
        
        Format your response as a JSON array of question objects. Each question should have these fields:
        - text: The question text
        - options: Array of 4 answer options
        - correct_answer: Index of correct answer (0-3)
        - explanation: Detailed explanation of why the answer is correct
        
        Make sure the questions test understanding, not just memorization.
        
        Return ONLY the JSON array with no additional text.
        """
        
    def _parse_questions(self, text: str) -> List[Dict]:
        """Parse the generated questions text into a structured format"""
        try:
            # Extract JSON from the response
            json_start = text.find('[')
            json_end = text.rfind(']') + 1
            
            if json_start == -1 or json_end == 0:
                # Try to find JSON objects if array not found
                json_start = text.find('{')
                json_end = text.rfind('}') + 1
                
                if json_start == -1 or json_end == 0:
                    raise ValueError("No JSON found in response")
                    
                # Wrap single object in array
                json_str = "[" + text[json_start:json_end] + "]"
            else:
                json_str = text[json_start:json_end]
                
            # Parse JSON
            questions = json.loads(json_str)
            
            # Ensure it's a list
            if not isinstance(questions, list):
                questions = [questions]
                
            # Validate each question
            validated_questions = []
            for question in questions:
                # Ensure required fields
                required_fields = ['text', 'options', 'correct_answer', 'explanation']
                valid = True
                
                for field in required_fields:
                    if field not in question:
                        valid = False
                        break
                        
                if valid and len(question['options']) >= 2:
                    validated_questions.append(question)
                    
            return validated_questions
            
        except Exception as e:
            print(f"Error parsing questions: {e}")
            return []
            
    async def generate_question(self, topic: str, difficulty: int) -> Optional[Dict]:
        """Generate a single question using OpenAI API"""
        # Check rate limits
        if self._should_reset_counter():
            self._reset_counter()
            
        if self.questions_generated_today >= self.daily_limit:
            print("Daily question generation limit reached")
            return None
            
        try:
            prompt = self._create_question_prompt(topic, difficulty)
            
            response = openai.ChatCompletion.create(
                model="gpt-3.5-turbo",  # Use the cheaper model
                messages=[
                    {"role": "system", "content": "You are an expert Python programming teacher."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.7,
                max_tokens=500
            )
            
            question_text = response.choices[0].message.content
            question = self._parse_question(question_text)
            
            # Validate the question
            errors = validate_question(question)
            if errors:
                print(f"Generated invalid question: {errors}")
                return None
                
            # Increment counter
            self.questions_generated_today += 1
            return question
            
        except Exception as e:
            print(f"Error generating question: {e}")
            return None
            
    async def generate_question_batch(self, topic: str, difficulty: int, count: int = 5) -> List[Dict]:
        """Generate a batch of questions"""
        questions = []
        for _ in range(min(count, self.daily_limit - self.questions_generated_today)):
            question = await self.generate_question(topic, difficulty)
            if question:
                questions.append(question)
            await asyncio.sleep(1)  # Rate limiting
        return questions
        
    def _create_question_prompt(self, topic: str, difficulty: int) -> str:
        """Create a prompt for question generation"""
        difficulty_desc = ["beginner", "intermediate", "advanced"][difficulty-1]
        
        return f"""
        Create a multiple-choice Python programming question about {topic} at {difficulty_desc} level.
        
        Format your response as a JSON object with these fields:
        - text: The question text
        - options: Array of 4 answer options
        - correct_answer: Index of correct answer (0-3)
        - explanation: Detailed explanation of why the answer is correct
        - topic: "{topic}"
        - difficulty: {difficulty}
        
        Make sure the question tests understanding, not just memorization.
        """
        
    def _parse_question(self, text: str) -> Dict:
        """Parse the generated question text into a structured format"""
        try:
            # Extract JSON from the response
            json_start = text.find('{')
            json_end = text.rfind('}') + 1
            if json_start == -1 or json_end == 0:
                raise ValueError("No JSON found in response")
                
            json_str = text[json_start:json_end]
            question = json.loads(json_str)
            
            # Ensure required fields
            required_fields = ['text', 'options', 'correct_answer', 'explanation', 'topic', 'difficulty']
            for field in required_fields:
                if field not in question:
                    question[field] = "" if field != 'options' else []
                    if field == 'correct_answer':
                        question[field] = 0
                    if field == 'difficulty':
                        question[field] = 1
                        
            return question
            
        except Exception as e:
            print(f"Error parsing question: {e}")
            return {
                'text': 'Error generating question',
                'options': ['Option 1', 'Option 2', 'Option 3', 'Option 4'],
                'correct_answer': 0,
                'explanation': 'This is a fallback question due to an error',
                'topic': 'Error',
                'difficulty': 1
            }
            
    def _should_reset_counter(self) -> bool:
        """Check if we should reset the counter based on date"""
        from datetime import datetime, date
        today = date.today()
        return self.last_reset_date is None or self.last_reset_date < today
        
    def _reset_counter(self):
        """Reset the daily counter"""
        from datetime import date
        self.questions_generated_today = 0
        self.last_reset_date = date.today() 