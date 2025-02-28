import requests

def test_server():
    try:
        # Test server is running
        response = requests.get('http://localhost:5000/')
        print("Server status:", response.json())

        # Test quiz initialization
        response = requests.post('http://localhost:5000/api/start-quiz', 
            json={'userId': '123', 'topic': 'general'})
        print("Quiz initialization:", response.json())

    except requests.exceptions.ConnectionError:
        print("Error: Could not connect to server. Make sure it's running on port 5000")

if __name__ == "__main__":
    test_server() 