# Adaptive Testing Platform

A sophisticated adaptive learning platform for Python programming that adjusts question difficulty based on user performance.

## Features

- **Adaptive Question Selection**: Questions automatically adapt to the user's skill level
- **Knowledge State Tracking**: Visual representation of progress across different Python topics
- **Admin Dashboard**: Generate questions, manage content, and analyze user performance
- **Interactive UI**: Modern, responsive interface with immediate feedback
- **Secure Authentication**: Admin-only access to management features

## Live Demo

The project is deployed at: [https://adaptivetest-ai.web.app](https://adaptivetest-ai.web.app)

## Setup Instructions

Follow these steps to run the project on your local machine:

### Prerequisites

- Node.js (v14+)
- Python (v3.8+)
- MongoDB
- Git

### Clone the Repository

```bash
git clone https://github.com/Aryanchhabra/adaptive-testing-platform.git
cd adaptive-testing-platform
```

### Frontend Setup

```bash
# Navigate to client directory
cd client

# Install dependencies
npm install

# Create a .env file with the following content
echo "VITE_API_URL=http://localhost:5000" > .env

# Start the development server
npm run dev
```

The frontend will be available at `http://localhost:3000`

### Backend Setup

```bash
# Navigate to server directory from the project root
cd server

# Create and activate a virtual environment
python -m venv venv
# On Windows
venv\Scripts\activate
# On macOS/Linux
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Set up environment variables (create a .env file)
echo "MONGODB_URI=mongodb://localhost:27017/adaptive_quiz" > .env
echo "PORT=5000" >> .env
echo "OPENAI_API_KEY=your_openai_api_key" >> .env

# Start the server
python app.py
```

The backend API will be available at `http://localhost:5000`

### MongoDB Setup

If you don't have MongoDB running locally, you can use MongoDB Atlas:

1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a cluster and get your connection string
3. Replace the MONGODB_URI in your .env file with the Atlas connection string

### Admin Access

To access the admin features:

1. Navigate to `/admin-login` in the application
2. Use the following credentials:
   - Email: `admin@adaptivetest.ai`
   - Password: `AdaptiveTest-Admin2024!`

## Project Structure

```
adaptive-testing-platform/
├── client/                    # React frontend
│   ├── public/                # Static assets
│   │   ├── components/        # UI components
│   │   │   ├── Admin/         # Admin-specific components
│   │   │   ├── Auth/          # Authentication components
│   │   │   └── Quiz/          # Quiz-related components
│   │   ├── contexts/          # React contexts
│   │   ├── hooks/             # Custom hooks
│   │   ├── firebase/          # Firebase configuration
│   │   └── App.jsx            # Main application component
│   └── vite.config.js         # Vite configuration
├── server/                    # Python backend
│   ├── data/                  # Data files
│   ├── models/                # Data models
│   ├── routes/                # API endpoints
│   ├── services/              # Business logic
│   ├── config/                # Configuration
│   ├── scripts/               # Utility scripts
│   └── app.py                 # Main server file
└── README.md                  # Project documentation
```

## API Endpoints

- `POST /api/quiz/start`: Start a new quiz session
- `POST /api/quiz/submit`: Submit an answer and get the next question
- `GET /api/questions`: Get all questions
- `POST /api/admin/generate-questions`: Generate new questions (admin only)

## Technologies Used

### Frontend
- React.js
- Material UI
- Framer Motion
- Firebase Authentication
- Vite

### Backend
- FastAPI
- MongoDB
- OpenAI API (for question generation)
- PyMongo

## Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add some amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## Troubleshooting

### Common Issues

1. **API Connection Error**
   - Ensure the backend server is running
   - Check that the API URL in the frontend's .env file matches the backend URL
   - Verify that CORS is enabled on the backend

2. **MongoDB Connection Issues**
   - Check your MongoDB connection string
   - Ensure MongoDB is running if using a local instance
   - Verify network access if using MongoDB Atlas

3. **Question Generation Not Working**
   - Verify your OpenAI API key is valid
   - Check the server logs for any API-related errors

## License

This project is licensed under the MIT License - see the LICENSE file for details.
