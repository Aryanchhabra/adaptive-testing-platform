from typing import List, Dict
import numpy as np
from services.ai_service import AIService
from models.knowledge_graph import KnowledgeGraph

class LearningPathService:
    def __init__(self, ai_service: AIService, knowledge_graph: KnowledgeGraph):
        self.ai_service = ai_service
        self.knowledge_graph = knowledge_graph
        
    async def generate_learning_path(self, 
                                   student_profile: Dict,
                                   target_concepts: List[str],
                                   time_constraint: int) -> Dict:
        """Generate personalized learning path using AI"""
        # Get current mastery levels
        mastery_data = self.knowledge_graph.concept_weights
        
        # Generate concept dependencies
        concept_map = await self.ai_service.generate_concept_map(
            ",".join(target_concepts)
        )
        
        # Get learning style analysis
        learning_style = await self._analyze_learning_style(student_profile)
        
        # Generate customized path
        prompt = f"""
        Create an optimal learning path with:
        - Student Profile: {student_profile}
        - Learning Style: {learning_style}
        - Current Mastery: {mastery_data}
        - Target Concepts: {target_concepts}
        - Time Available: {time_constraint} hours
        - Concept Dependencies: {concept_map}
        
        Provide:
        1. Sequenced learning steps
        2. Estimated time per concept
        3. Recommended resources per learning style
        4. Milestone checkpoints
        5. Alternative paths if stuck
        Format as detailed JSON.
        """
        
        response = await self.ai_service.client.chat.completions.create(
            model="gpt-4",
            messages=[{"role": "system", "content": prompt}],
            temperature=0.7
        )
        
        return response.choices[0].message.content
        
    async def _analyze_learning_style(self, student_profile: Dict) -> Dict:
        """Analyze student's learning style preferences"""
        prompt = f"""
        Analyze learning style from:
        - Question response patterns: {student_profile.get('response_patterns', [])}
        - Time spent per question type: {student_profile.get('time_patterns', {})}
        - Previous performance: {student_profile.get('performance_history', [])}
        
        Determine:
        1. Primary learning style (visual/auditory/kinesthetic)
        2. Optimal content format
        3. Best practice methods
        4. Attention span patterns
        5. Recommended study session duration
        Format as JSON.
        """
        
        response = await self.ai_service.client.chat.completions.create(
            model="gpt-4",
            messages=[{"role": "system", "content": prompt}],
            temperature=0.5
        )
        
        return response.choices[0].message.content 