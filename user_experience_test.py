# user_experience_test.py
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time
import json
import os

# Create results directory
if not os.path.exists('test_results/ux'):
    os.makedirs('test_results/ux')

# Initialize metrics
ux_metrics = {
    "test_cases": [],
    "summary": {
        "avg_time_to_complete_quiz": 0,
        "avg_time_per_question": 0,
        "navigation_success_rate": 0,
        "user_error_count": 0
    }
}

# Setup browser
driver = webdriver.Chrome()
driver.get("http://localhost:3000")  # Your frontend URL

try:
    # Test login flow
    print("Testing login flow...")
    login_start = time.time()
    
    # Click login button
    WebDriverWait(driver, 10).until(
        EC.element_to_be_clickable((By.XPATH, "//button[contains(text(), 'Login')]"))
    ).click()
    
    # Enter credentials
    WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.ID, "email"))
    ).send_keys("test@example.com")
    
    driver.find_element(By.ID, "password").send_keys("password123")
    driver.find_element(By.XPATH, "//button[@type='submit']").click()
    
    # Wait for dashboard
    WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.XPATH, "//h1[contains(text(), 'Dashboard')]"))
    )
    
    login_time = time.time() - login_start
    print(f"✅ Login successful in {login_time:.2f} seconds")
    
    # Start a quiz
    print("Starting a quiz...")
    WebDriverWait(driver, 10).until(
        EC.element_to_be_clickable((By.XPATH, "//button[contains(text(), 'Start Quiz')]"))
    ).click()
    
    # Answer 5 questions
    total_question_time = 0
    questions_answered = 0
    
    for i in range(5):
        try:
            question_start = time.time()
            
            # Wait for question to load
            WebDriverWait(driver, 15).until(
                EC.presence_of_element_located((By.XPATH, "//div[contains(@class, 'question')]"))
            )
            
            # Select an answer (first option)
            WebDriverWait(driver, 10).until(
                EC.element_to_be_clickable((By.XPATH, "//div[contains(@class, 'option')]"))
            ).click()
            
            # Submit answer
            WebDriverWait(driver, 10).until(
                EC.element_to_be_clickable((By.XPATH, "//button[contains(text(), 'Submit')]"))
            ).click()
            
            # If there's a "Next" button, click it
            try:
                WebDriverWait(driver, 10).until(
                    EC.element_to_be_clickable((By.XPATH, "//button[contains(text(), 'Next')]"))
                ).click()
            except:
                # Might be the last question
                pass
                
            question_time = time.time() - question_start
            total_question_time += question_time
            questions_answered += 1
            
            print(f"✅ Question {i+1} answered in {question_time:.2f} seconds")
            
        except Exception as e:
            print(f"❌ Error on question {i+1}: {e}")
            ux_metrics["summary"]["user_error_count"] += 1
    
    # Calculate averages
    if questions_answered > 0:
        ux_metrics["summary"]["avg_time_per_question"] = total_question_time / questions_answered
        print(f"Average time per question: {ux_metrics['summary']['avg_time_per_question']:.2f} seconds")
    
    # Check if quiz completion page is reached
    try:
        WebDriverWait(driver, 15).until(
            EC.presence_of_element_located((By.XPATH, "//h2[contains(text(), 'Quiz Completed')]"))
        )
        print("✅ Quiz completed successfully")
        ux_metrics["summary"]["navigation_success_rate"] = 1.0
    except:
        print("❌ Quiz completion page not reached")
        ux_metrics["summary"]["navigation_success_rate"] = 0.0
        
except Exception as e:
    print(f"❌ Test failed: {e}")
finally:
    # Save metrics
    with open('test_results/ux/ux_metrics.json', 'w') as f:
        json.dump(ux_metrics, f, indent=2)
    
    # Close browser
    driver.quit()
    print("Test completed. Results saved to test_results/ux/ux_metrics.json")