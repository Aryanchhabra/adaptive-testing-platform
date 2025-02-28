from firebase_config import bucket

def test_csv_access():
    try:
        print("Bucket name:", bucket.name)
        
        # Try to access the CSV file
        blob = bucket.blob('python_questions_dataset.csv')
        content = blob.download_as_string()
        print("Successfully accessed the CSV file!")
        print(f"File size: {len(content)} bytes")
        
        # Print first few lines
        print("\nFirst few lines of the file:")
        print(content.decode('utf-8')[:200])
        
    except Exception as e:
        print(f"Error accessing CSV: {e}")

if __name__ == "__main__":
    test_csv_access() 