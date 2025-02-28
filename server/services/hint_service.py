from typing import Dict, List
from services.ai_service import AIService

class HintService:
    def __init__(self, ai_service: AIService):
        self.ai_service = ai_service
        
    async def generate_progressive_hints(self, 
                                      question: Dict, 
                                      previous_attempts: List[int],
                                      time_spent: float) -> List[str]:
        """Generate progressive hints based on student's attempts"""
        prompt = f"""
        Question: {question['text']}
        Previous attempts: {previous_attempts}
        Time spent: {time_spent} seconds
        
        Generate 3 progressive hints:
        1. Subtle hint (general direction)
        2. Medium hint (concept reminder)
        3. Strong hint (specific guidance)
        
        Each hint should:
        - Not give away the answer
        - Build on previous hints
        - Consider previous attempts
        - Adapt to time spent
        Format as JSON array.
        """
        
        response = await self.ai_service.client.chat.completions.create(
            model="gpt-4",
            messages=[{"role": "system", "content": prompt}],
            temperature=0.7
        )
        
        return response.choices[0].message.content

    async def generate_misconception_analysis(self, 
                                           wrong_answers: List[int],
                                           question: Dict) -> Dict:
        """Analyze potential misconceptions from wrong answers"""
        prompt = f"""
        Analyze these wrong answers:
        Question: {question['text']}
        Wrong choices: {[question['options'][i] for i in wrong_answers]}
        
        Provide:
        1. Likely misconceptions
        2. Conceptual gaps
        3. Recommended clarifications
        4. Practice problems targeting these gaps
        Format as JSON.
        """
        
        response = await self.ai_service.client.chat.completions.create(
            model="gpt-4",
            messages=[{"role": "system", "content": prompt}],
            temperature=0.6
        )
        
        return response.choices[0].message.content 