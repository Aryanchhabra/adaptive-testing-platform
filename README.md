# AdaptiveTestAI

An adaptive testing platform that uses AI to generate questions and personalize learning experiences.

## Features

- **Adaptive Testing**: Questions adapt to the user's knowledge level
- **AI-Generated Questions**: Uses OpenAI API to generate Python programming questions
- **Performance Analytics**: Tracks user performance and provides insights
- **Topic-Based Learning**: Organizes questions by programming topics
- **Difficulty Levels**: Supports beginner, intermediate, and advanced questions

## Tech Stack

- **Frontend**: React, Material-UI
- **Backend**: FastAPI, Flask
- **Database**: MongoDB
- **AI**: OpenAI API (GPT-3.5 Turbo)

## Setup Instructions

### Prerequisites

- Node.js and npm
- Python 3.8+
- MongoDB (local or Atlas)
- OpenAI API key

### Environment Setup

1. Clone the repository
   ```
   git clone https://github.com/yourusername/adaptive-testing-platform.git
   cd adaptive-testing-platform
   ```

2. Create a `.env` file in the root directory with the following variables:
   ```
   MONGODB_URL=your_mongodb_connection_string
   DATABASE_NAME=adaptive_quiz
   OPENAI_API_KEY=your_openai_api_key
   ```

### Backend Setup

1. Install Python dependencies
   ```
   pip install -r requirements.txt
   ```

2. Start the server
   ```
   python server/app.py
   ```

### Frontend Setup

1. Install Node.js dependencies
   ```
   cd client
   npm install
   ```

2. Start the React development server
   ```
   npm start
   ```

## Usage

### Student Interface

1. Navigate to `http://localhost:3000`
2. Start a new quiz
3. Answer questions and receive immediate feedback
4. View performance analysis at the end of the quiz

### Admin Interface

1. Navigate to `http://localhost:3000/admin/question-generator`
2. Select a topic, difficulty level, and number of questions
3. Generate AI-powered questions
4. View and manage the question bank

## AI Question Generation

The platform uses OpenAI's GPT-3.5 Turbo model to generate high-quality programming questions. The implementation includes:

- Rate limiting to manage API usage
- Question validation to ensure quality
- Topic and difficulty customization
- Batch generation capability

## Project Structure

```
adaptive-testing-platform/
├── client/                 # React frontend
├── server/                 # Python backend
│   ├── config/             # Configuration files
│   ├── database/           # Database connection and operations
│   ├── models/             # Data models
│   ├── routes/             # API routes
│   ├── services/           # Business logic
│   └── app.py              # Main application entry point
├── .env                    # Environment variables
└── README.md               # Project documentation
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- OpenAI for providing the API for question generation
- MongoDB for the flexible document database
- FastAPI and Flask for the backend framework
- React and Material-UI for the frontend components
