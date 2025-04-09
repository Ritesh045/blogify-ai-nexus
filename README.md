
# AI Blog Website

A full-stack AI-powered blog platform with Flask backend, MongoDB database, and React frontend.

## Project Structure

- `frontend/`: React application with TypeScript, React Router, and Tailwind CSS
- `backend/`: Flask API server connecting to MongoDB
- Database: MongoDB for storing users, blog posts, and comments

## Frontend Setup

```sh
# Install dependencies
npm install

# Start the development server
npm run dev
```

## Backend Setup

```sh
# Navigate to backend directory
cd backend

# Create and activate a virtual environment (recommended)
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start the Flask server
python app.py
```

## MongoDB Setup

1. Install MongoDB locally or use a cloud service like MongoDB Atlas
2. Set your MongoDB connection string as an environment variable:
   ```
   # For local development
   export MONGO_URI="mongodb://localhost:27017/ai_blog"
   
   # For MongoDB Atlas
   export MONGO_URI="mongodb+srv://username:password@cluster.mongodb.net/ai_blog"
   ```

## Features

- User authentication (login/signup)
- Blog post creation and management
- Comment system with spam detection
- AI-powered content suggestions
- Responsive design with Tailwind CSS

## API Endpoints

### Authentication
- `POST /api/auth/login`: User login
- `POST /api/auth/signup`: User registration

### Blog Posts
- `GET /api/posts`: Get all posts
- `GET /api/posts/:id`: Get a specific post
- `POST /api/posts`: Create a new post
- `PUT /api/posts/:id`: Update a post
- `DELETE /api/posts/:id`: Delete a post
- `POST /api/posts/:id/like`: Like a post

### Comments
- `POST /api/posts/:id/comments`: Add a comment to a post
- `DELETE /api/posts/:id/comments/:commentId`: Delete a comment

### AI Features
- `POST /api/ai/suggestions`: Get AI content suggestions
