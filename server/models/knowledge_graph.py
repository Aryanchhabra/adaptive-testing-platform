from typing import Dict, List, Set
import networkx as nx
import numpy as np

class KnowledgeGraph:
    def __init__(self):
        self.graph = nx.DiGraph()
        self.concept_weights = {}
        
    def add_concept(self, concept_id: str, prerequisites: List[str]):
        """Add a concept node with its prerequisites"""
        self.graph.add_node(concept_id)
        for prereq in prerequisites:
            self.graph.add_edge(prereq, concept_id)
            
    def update_mastery(self, concept_id: str, performance: float):
        """Update concept mastery based on performance"""
        current_weight = self.concept_weights.get(concept_id, 0.5)
        new_weight = current_weight * 0.7 + performance * 0.3
        self.concept_weights[concept_id] = new_weight
        
        # Propagate effect to connected concepts
        for neighbor in self.graph.neighbors(concept_id):
            neighbor_weight = self.concept_weights.get(neighbor, 0.5)
            self.concept_weights[neighbor] = neighbor_weight * 0.9 + new_weight * 0.1
            
    def get_ready_concepts(self, mastery_threshold: float = 0.7) -> Set[str]:
        """Get concepts ready to learn based on prerequisites"""
        ready_concepts = set()
        
        for concept in self.graph.nodes():
            prerequisites = list(self.graph.predecessors(concept))
            if not prerequisites:
                ready_concepts.add(concept)
                continue
                
            prereq_mastery = [
                self.concept_weights.get(p, 0) 
                for p in prerequisites
            ]
            
            if all(m >= mastery_threshold for m in prereq_mastery):
                ready_concepts.add(concept)
                
        return ready_concepts 