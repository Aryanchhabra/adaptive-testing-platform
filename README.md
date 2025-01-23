# HackMIT Project Template

A modern full-stack web application template using React, Flask, and PostgreSQL. This template provides a solid foundation for building scalable web applications with a robust frontend, backend, and database setup.

## 🚀 Features

- **React Frontend**: Modern UI with Vite for fast development
- **Flask Backend**: RESTful API server with Python
- **PostgreSQL Database**: Reliable data persistence
- **Development Ready**: Hot-reloading and debug support
- **Production Ready**: Easy deployment configuration

## 🛠️ Tech Stack

- Frontend: React + Vite
- Backend: Flask + SQLAlchemy
- Database: PostgreSQL
- Additional Tools: Python virtual environment, Node.js

## 📦 Installation

### Prerequisites
- Python 3.7+
- Node.js 14+
- PostgreSQL

### Frontend Setup
```bash
cd client
yarn install
yarn run dev
```

### Backend Setup
1. Create a PostgreSQL database
2. Set up environment variables:
```bash
cd server
cp .env.example .env
# Update SQLALCHEMY_DATABASE_URI in .env
```

3. Install Python dependencies:
```bash
python3 -m venv env
source env/bin/activate
pip3 install -r requirements.txt
flask run
```

## 🏃‍♂️ Development

- Frontend runs on: `http://localhost:5173`
- Backend runs on: `http://localhost:5000`

## 📝 Project Structure
```
├── client/          # React frontend
├── server/          # Flask backend
│   ├── api/         # API routes
│   └── models/      # Database models
└── README.md
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **Your Name** - [GitHub Profile](https://github.com/aryanchhabra)

## 🙏 Acknowledgments

- HackMIT for providing the initial template
- The open-source community for continuous inspiration
