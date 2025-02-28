from firebase_config import bucket

def test_storage():
    try:
        # List all files in bucket
        blobs = bucket.list_blobs()
        print("Successfully connected to storage bucket!")
        print("\nFiles in bucket:")
        for blob in blobs:
            print(f"- {blob.name}")
    except Exception as e:
        print(f"Error connecting to storage: {e}")

if __name__ == "__main__":
    test_storage() 