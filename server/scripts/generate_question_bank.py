import asyncio
import json
import os
from services.ai_question_generator import AIQuestionGenerator
from config.mongodb import MongoDB

async def generate_question_bank():
    """Generate a large bank of questions and save to database"""
    generator = AIQuestionGenerator()
    
    topics = [
        'Basic Python Syntax',
        'Data Types and Variables',
        'Control Flow',
        'Functions',
        'Object-Oriented Programming'
    ]
    
    difficulties = [1, 2, 3]
    questions_per_combination = 10
    
    all_questions = []
    
    for topic in topics:
        for difficulty in difficulties:
            print(f"Generating {questions_per_combination} questions for {topic} at difficulty {difficulty}")
            questions = await generator.generate_question_batch(
                topic, 
                difficulty, 
                questions_per_combination
            )
            all_questions.extend(questions)
            
            # Save to JSON as backup
            with open(f"question_bank/{topic.replace(' ', '_')}_{difficulty}.json", "w") as f:
                json.dump(questions, f, indent=2)
                
            # Add delay to respect rate limits
            await asyncio.sleep(5)
    
    # Save all questions to database
    db = await MongoDB.connect_db()
    if all_questions:
        result = await db.questions.insert_many(all_questions)
        print(f"Added {len(result.inserted_ids)} questions to database")
    
    await MongoDB.close_db()

if __name__ == "__main__":
    # Create directory if it doesn't exist
    os.makedirs("question_bank", exist_ok=True)
    asyncio.run(generate_question_bank()) 