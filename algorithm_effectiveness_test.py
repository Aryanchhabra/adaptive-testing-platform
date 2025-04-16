# algorithm_effectiveness_test.py
import requests
import matplotlib.pyplot as plt
import numpy as np
import json
import os

# Create results directory
if not os.path.exists('test_results/algorithm'):
    os.makedirs('test_results/algorithm')

BASE_URL = "http://localhost:5000"  # Change to your API URL
SESSIONS = 5  # Number of test sessions to run

def simulate_user_session(skill_level):
    """Simulate a quiz session with user of specific skill level"""
    print(f"Simulating {skill_level} user session...")
    
    # Start quiz
    session_resp = requests.post(f"{BASE_URL}/api/quiz/start")
    if session_resp.status_code != 200:
        print(f"❌ Failed to start session: {session_resp.status_code}")
        return None
    
    session_data = session_resp.json()
    session_id = session_data.get("session_id")
    
    difficulty_progression = []
    topics_covered = set()
    correct_answers = 0
    total_questions = 10  # We'll answer 10 questions
    
    # Define answer correctness based on skill level
    if skill_level == "beginner":
        # Beginners get 40% correct
        correctness_pattern = [0, 1, 0, 0, 1, 0, 1, 0, 0, 1]
    elif skill_level == "intermediate":
        # Intermediates get 60% correct
        correctness_pattern = [1, 0, 1, 1, 0, 1, 0, 1, 1, 0]
    else:  # advanced
        # Advanced get 80% correct
        correctness_pattern = [1, 1, 0, 1, 1, 1, 1, 0, 1, 1]
    
    for q_num in range(total_questions):
        # Get current question
        if q_num == 0:
            # Already have first question from session start
            question = session_data.get("question", {})
        else:
            # Get next question from previous answer response
            question = next_question
        
        question_id = question.get("id")
        difficulty = question.get("difficulty", 0)
        topic = question.get("topic", "unknown")
        
        difficulty_progression.append(difficulty)
        topics_covered.add(topic)
        
        # Answer question (according to skill pattern)
        is_correct = correctness_pattern[q_num]
        if is_correct:
            correct_answers += 1
            
        # Choose first option (dummy selection)
        options = question.get("options", [])
        selected_option = 0 if options else None
        
        # Submit answer
        submit_resp = requests.post(
            f"{BASE_URL}/api/quiz/submit",
            json={
                "question_id": question_id,
                "selected_option": selected_option,
                "session_id": session_id,
                "time_taken": 10.5  # Arbitrary time
            }
        )
        
        if submit_resp.status_code != 200:
            print(f"❌ Failed to submit answer: {submit_resp.status_code}")
            break
            
        response_data = submit_resp.json()
        next_question = response_data.get("next_question")
        
        # Stop if no more questions
        if not next_question and q_num < total_questions - 1:
            break
    
    return {
        "difficulty_progression": difficulty_progression,
        "topics_covered": list(topics_covered),
        "topics_count": len(topics_covered),
        "correct_answers": correct_answers,
        "total_questions": q_num + 1,
        "accuracy": correct_answers / (q_num + 1) if q_num > 0 else 0
    }

# Run multiple sessions for different user types
results = {
    "beginner": [],
    "intermediate": [],
    "advanced": []
}

for skill_level in results.keys():
    for i in range(SESSIONS):
        session_result = simulate_user_session(skill_level)
        if session_result:
            results[skill_level].append(session_result)
            print(f"✅ {skill_level.capitalize()} session {i+1} complete")

# Calculate averages
averages = {}
for level, sessions in results.items():
    if sessions:
        avg_difficulty = np.mean([s["difficulty_progression"] for s in sessions], axis=0)
        avg_topics = np.mean([s["topics_count"] for s in sessions])
        avg_accuracy = np.mean([s["accuracy"] for s in sessions])
        
        averages[level] = {
            "avg_difficulty": avg_difficulty.tolist(),
            "avg_topics_covered": avg_topics,
            "avg_accuracy": avg_accuracy
        }

# Plot difficulty progression
plt.figure(figsize=(10, 6))
question_nums = np.arange(1, min(len(averages[level]["avg_difficulty"]) for level in averages)+1)

for level, data in averages.items():
    plt.plot(question_nums, data["avg_difficulty"][:len(question_nums)], 'o-', 
             label=f"{level.capitalize()} (Accuracy: {data['avg_accuracy']:.2%})")

plt.xlabel('Question Number')
plt.ylabel('Question Difficulty')
plt.title('Difficulty Adaptation by User Skill Level')
plt.legend()
plt.grid(True)
plt.savefig('test_results/algorithm/difficulty_adaptation.png')

# Plot topic coverage
levels = list(averages.keys())
topic_coverage = [averages[level]["avg_topics_covered"] for level in levels]

plt.figure(figsize=(8, 5))
plt.bar(levels, topic_coverage, color=['blue', 'orange', 'green'])
plt.xlabel('User Skill Level')
plt.ylabel('Average Topics Covered')
plt.title('Topic Coverage by User Skill Level')
plt.savefig('test_results/algorithm/topic_coverage.png')

# Save results
with open('test_results/algorithm/algorithm_results.json', 'w') as f:
    json.dump({
        "session_results": results,
        "averages": averages
    }, f, indent=2)

print("Algorithm tests completed. Results saved to test_results/algorithm/")