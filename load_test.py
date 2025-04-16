# load_test.py
import requests
import time
import concurrent.futures
import matplotlib.pyplot as plt
import numpy as np
import json
import os

# Create results directory
if not os.path.exists('test_results/load'):
    os.makedirs('test_results/load')

BASE_URL = "http://localhost:5000"  # Change to your API URL

# Test parameters
CONCURRENT_USERS = [1, 5, 10, 20, 30, 40, 50]  # Number of concurrent users to simulate
REQUESTS_PER_USER = 10  # Number of requests each user will make

def make_request(endpoint):
    """Make a single request and return response time"""
    start_time = time.time()
    try:
        response = requests.get(f"{BASE_URL}{endpoint}")
        status_code = response.status_code
    except Exception as e:
        status_code = 0  # Request failed
    
    duration = time.time() - start_time
    return {
        "duration": duration,
        "status_code": status_code,
        "success": 200 <= status_code < 300
    }

def simulate_user(user_id):
    """Simulate a user making multiple requests"""
    results = []
    
    # Users will hit various endpoints
    endpoints = [
        "/api/health",  # Simple health check
        "/api/topics",  # Get topics list
        "/api/questions/sample"  # Get sample question
    ]
    
    for i in range(REQUESTS_PER_USER):
        # Pick an endpoint (cycling through the list)
        endpoint = endpoints[i % len(endpoints)]
        result = make_request(endpoint)
        results.append({
            "user_id": user_id,
            "request_num": i,
            "endpoint": endpoint,
            **result
        })
        
        # Small delay between requests
        time.sleep(0.2)
        
    return results

# Run load tests with different numbers of concurrent users
load_test_results = {}

for num_users in CONCURRENT_USERS:
    print(f"Testing with {num_users} concurrent users...")
    start_time = time.time()
    
    all_results = []
    with concurrent.futures.ThreadPoolExecutor(max_workers=num_users) as executor:
        future_to_user = {executor.submit(simulate_user, user_id): user_id 
                          for user_id in range(num_users)}
        
        for future in concurrent.futures.as_completed(future_to_user):
            user_results = future.result()
            all_results.extend(user_results)
    
    total_time = time.time() - start_time
    
    # Calculate metrics
    success_rate = sum(1 for r in all_results if r["success"]) / len(all_results) if all_results else 0
    avg_response_time = np.mean([r["duration"] for r in all_results])
    p95_response_time = np.percentile([r["duration"] for r in all_results], 95)
    
    load_test_results[num_users] = {
        "total_time": total_time,
        "requests_processed": len(all_results),
        "avg_response_time": avg_response_time,
        "p95_response_time": p95_response_time,
        "success_rate": success_rate,
        "throughput": len(all_results) / total_time
    }
    
    print(f"✅ Completed: Avg response time: {avg_response_time:.4f}s, Success rate: {success_rate:.2%}")

# Plot results
users = list(load_test_results.keys())
avg_times = [load_test_results[u]["avg_response_time"] for u in users]
p95_times = [load_test_results[u]["p95_response_time"] for u in users]
success_rates = [load_test_results[u]["success_rate"] * 100 for u in users]

fig, ax1 = plt.subplots(figsize=(10, 6))

color = 'tab:blue'
ax1.set_xlabel('Concurrent Users')
ax1.set_ylabel('Response Time (s)', color=color)
ax1.plot(users, avg_times, 'o-', color=color, label='Avg Response Time')
ax1.plot(users, p95_times, 's--', color='tab:green', label='P95 Response Time')
ax1.tick_params(axis='y', labelcolor=color)
ax1.set_ylim(bottom=0)
ax1.legend(loc='upper left')

ax2 = ax1.twinx()
color = 'tab:red'
ax2.set_ylabel('Success Rate (%)', color=color)
ax2.plot(users, success_rates, 'D-.', color=color, label='Success Rate')
ax2.tick_params(axis='y', labelcolor=color)
ax2.set_ylim(0, 105)

fig.tight_layout()
plt.title('System Performance Under Load')
plt.savefig('test_results/load/load_test_results.png')

# Save results
with open('test_results/load/load_test_results.json', 'w') as f:
    json.dump(load_test_results, f, indent=2)

print("Load test completed. Results saved to test_results/load/")