import os
from typing import Dict, List, Optional
import json
from llama_cpp import Llama  # Or use GPT4All

class LocalLLMQuestionGenerator:
    def __init__(self, model_path="models/llama-2-7b-chat.ggmlv3.q4_0.bin"):
        # Make sure you download the model first
        self.model_path = model_path
        self.llm = Llama(model_path=model_path, n_ctx=2048)
        
    async def generate_question(self, topic: str, difficulty: int) -> Optional[Dict]:
        """Generate a question using a local LLM"""
        try:
            prompt = self._create_question_prompt(topic, difficulty)
            
            # Generate text with the local model
            output = self.llm(
                prompt,
                max_tokens=512,
                stop=["```"],
                temperature=0.7
            )
            
            question_text = output['choices'][0]['text']
            question = self._parse_question(question_text)
            
            return question
            
        except Exception as e:
            print(f"Error generating question with local LLM: {e}")
            return None
            
    # Rest of the methods similar to the OpenAI version 