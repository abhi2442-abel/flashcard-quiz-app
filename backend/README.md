# Backend API

## Setup
```bash
cd backend
npm install
```

## Endpoints

### Quiz Management
- `POST /api/quizzes` - Create a new quiz
- `GET /api/quizzes/:id` - Get quiz details
- `PUT /api/quizzes/:id` - Update quiz
- `DELETE /api/quizzes/:id` - Delete quiz

### Student Responses
- `POST /api/responses` - Submit a response
- `GET /api/quizzes/:id/responses` - Get all responses for a quiz

### Analytics
- `GET /api/quizzes/:id/analytics` - Get quiz statistics
- `GET /api/quizzes/:id/analytics/option/:option` - Get students who chose option

## Database Schema
See `database/schema.sql` for detailed schema
