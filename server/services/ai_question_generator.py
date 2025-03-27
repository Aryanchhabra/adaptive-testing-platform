import os
import json
import asyncio
from typing import List, Dict, Optional
from dotenv import load_dotenv
from pathlib import Path
import traceback
from datetime import datetime, date

# Load environment variables from root directory
root_dir = Path(__file__).resolve().parent.parent.parent
dotenv_path = root_dir / '.env'
load_dotenv(dotenv_path=dotenv_path)

class AIQuestionGenerator:
    def __init__(self):
        # Get API key from environment
        self.api_key = os.getenv('OPENAI_API_KEY')
        if not self.api_key:
            raise ValueError("OpenAI API key not found in environment variables")
            
        # Get configuration from environment variables
        self.model = os.getenv('OPENAI_MODEL', 'gpt-3.5-turbo')
        self.max_tokens = int(os.getenv('MAX_TOKENS', '800'))
        self.temperature = float(os.getenv('TEMPERATURE', '0.7'))
        
        # Set rate limits to control costs
        self.daily_limit = int(os.getenv('DAILY_QUESTION_LIMIT', '20'))
        self.questions_generated_today = 0
        self.last_reset_date = None
        
        print(f"AI Question Generator initialized with model: {self.model}")
        print(f"API key length: {len(self.api_key)} characters")
        
    def generate_questions(self, topic: str, difficulty: int, count: int = 5) -> List[Dict]:
        """Generate a batch of questions using OpenAI API"""
        try:
            # Check rate limits
            if self._should_reset_counter():
                self._reset_counter()
                
            # Adjust count based on remaining daily limit
            count = min(count, self.daily_limit - self.questions_generated_today)
            if count <= 0:
                print("Daily question generation limit reached")
                return []
            
            # Create a prompt for generating multiple questions at once
            prompt = self._create_batch_prompt(topic, difficulty, count)
            print(f"Prompt created, length: {len(prompt)} characters")
            
            # Import OpenAI here to ensure we're using the latest version
            try:
                from openai import OpenAI
                client = OpenAI(api_key=self.api_key)
                
                print(f"Making API call to OpenAI with model: {self.model}")
                response = client.chat.completions.create(
                    model=self.model,
                    messages=[
                        {"role": "system", "content": "You are an expert Python programming teacher."},
                        {"role": "user", "content": prompt}
                    ],
                    temperature=self.temperature,
                    max_tokens=self.max_tokens
                )
                
                response_text = response.choices[0].message.content
                print(f"Received response from OpenAI, length: {len(response_text)} characters")
                print(f"Response preview: {response_text[:100]}...")
                
            except ImportError:
                print("Failed to import OpenAI client. Please install the latest version with: pip install --upgrade openai")
                return []
            except Exception as api_error:
                print(f"OpenAI API error: {str(api_error)}")
                traceback.print_exc()
                return []
            
            # Extract and parse the response
            questions = self._parse_questions(response_text)
            print(f"Parsed {len(questions)} questions from response")
            
            # Add metadata to each question
            for question in questions:
                question['topic'] = topic
                question['difficulty'] = difficulty
                
            # Update counter
            self.questions_generated_today += len(questions)
            
            return questions
            
        except Exception as e:
            print(f"Error generating questions: {e}")
            traceback.print_exc()
            return []
        
    def _create_batch_prompt(self, topic: str, difficulty: int, count: int) -> str:
        """Create a prompt for generating multiple questions at once"""
        difficulty_desc = ["beginner", "intermediate", "advanced"][min(difficulty-1, 2)]
        
        return f"""
        Create {count} multiple-choice Python programming questions about {topic} at {difficulty_desc} level.
        
        Format your response as a JSON array of question objects. Each question should have these fields:
        - id: A unique identifier (e.g., "q1", "q2")
        - text: The question text
        - options: Array of 4 answer options
        - correctAnswer: Index of correct answer (0-3)
        - explanation: Detailed explanation of why the answer is correct
        
        Make sure:
        1. Questions test understanding, not just memorization
        2. Each question has exactly 4 options
        3. The correct answer index is between 0-3
        4. The correct answer is distributed (not always the same index)
        5. The explanation is clear and educational
        
        Return ONLY the JSON array with no additional text.
        """
        
    def _parse_questions(self, text: str) -> List[Dict]:
        """Parse the generated questions text into a structured format"""
        try:
            # Print the raw text for debugging
            print(f"Parsing text: {text[:200]}...")
            
            # Extract JSON from the response
            json_start = text.find('[')
            json_end = text.rfind(']') + 1
            
            if json_start == -1 or json_end == 0:
                # Try to find JSON objects if array not found
                json_start = text.find('{')
                json_end = text.rfind('}') + 1
                
                if json_start == -1 or json_end == 0:
                    print("No JSON found in response")
                    return []
                    
                # Wrap single object in array
                json_str = "[" + text[json_start:json_end] + "]"
            else:
                json_str = text[json_start:json_end]
                
            # Parse JSON
            print(f"Extracted JSON: {json_str[:200]}...")
            questions = json.loads(json_str)
            
            # Ensure it's a list
            if not isinstance(questions, list):
                questions = [questions]
                
            # Validate and standardize each question
            validated_questions = []
            for question in questions:
                # Standardize field names (some models use different conventions)
                if 'correct_answer' in question and 'correctAnswer' not in question:
                    question['correctAnswer'] = question['correct_answer']
                
                # Ensure required fields
                required_fields = ['text', 'options', 'correctAnswer', 'explanation']
                valid = True
                
                for field in required_fields:
                    if field not in question:
                        print(f"Question missing required field: {field}")
                        valid = False
                        break
                        
                if valid and len(question['options']) >= 2:
                    validated_questions.append(question)
                    
            return validated_questions
            
        except Exception as e:
            print(f"Error parsing questions: {e}")
            traceback.print_exc()
            return []
            
    def _should_reset_counter(self) -> bool:
        """Check if we should reset the counter based on date"""
        today = date.today()
        return self.last_reset_date is None or self.last_reset_date < today
        
    def _reset_counter(self):
        """Reset the daily counter"""
        self.questions_generated_today = 0
        self.last_reset_date = date.today() 