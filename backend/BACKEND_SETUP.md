# Backend Setup Instructions

## 🎯 Quick Start

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Setup MongoDB

**Option A: Local MongoDB (Recommended for Development)**
```bash
# Download MongoDB Community Edition
# https://www.mongodb.com/try/download/community

# Start MongoDB service (Windows/Mac/Linux)
mongod

# Or use MongoDB in Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

**Option B: MongoDB Atlas (Cloud - Free Tier)**
1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create cluster
4. Get connection string: `mongodb+srv://username:password@cluster.mongodb.net/flashcard-quiz`
5. Update `.env` file with the connection string

### 3. Configure Environment Variables
```bash
cp .env.example .env
# Edit .env and update:
# - MONGODB_URI (if using Atlas)
# - PORT (optional, default 5000)
# - NODE_ENV (development/production)
```

### 4. Start Backend Server
```bash
npm run dev
```

✅ **Success!** You should see:
```
✅ Server running on http://localhost:5000
📝 Health Check: http://localhost:5000/health
🎯 Quiz API: http://localhost:5000/api/quizzes
✅ MongoDB Connected
   Host: localhost
   Database: flashcard-quiz
```

---

## 📚 API Endpoints

### Quiz Management

**Create Quiz** (POST)
```bash
curl -X POST http://localhost:5000/api/quizzes \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Biology Quiz",
    "description": "Test your biology knowledge",
    "createdBy": "teacher1",
    "timeLimit": 600,
    "questions": [
      {
        "text": "What is the powerhouse of the cell?",
        "options": {
          "A": "Nucleus",
          "B": "Mitochondria",
          "C": "Ribosome",
          "D": "Chloroplast"
        },
        "correctAnswer": "B"
      }
    ]
  }'
```

**Get All Quizzes** (GET)
```bash
curl http://localhost:5000/api/quizzes
```

**Get Single Quiz** (GET)
```bash
curl http://localhost:5000/api/quizzes/{quiz_id}
```

**Start Quiz** (PATCH)
```bash
curl -X PATCH http://localhost:5000/api/quizzes/{quiz_id}/status \
  -H "Content-Type: application/json" \
  -d '{"status": "active"}'
```

**End Quiz** (PATCH)
```bash
curl -X PATCH http://localhost:5000/api/quizzes/{quiz_id}/status \
  -H "Content-Type: application/json" \
  -d '{"status": "completed"}'
```

### Student Responses

**Submit All Responses** (POST)
```bash
curl -X POST http://localhost:5000/api/responses \
  -H "Content-Type: application/json" \
  -d '{
    "quizId": "64abc123def456",
    "studentId": "student1",
    "studentName": "John Doe",
    "responses": [
      {
        "questionId": "q-1234567-0",
        "selectedOption": "B"
      }
    ]
  }'
```

**Submit Single Response (Real-time)** (POST)
```bash
curl -X POST http://localhost:5000/api/responses/submit-single \
  -H "Content-Type: application/json" \
  -d '{
    "quizId": "64abc123def456",
    "studentId": "student1",
    "questionId": "q-1234567-0",
    "selectedOption": "B",
    "detectionConfidence": 0.95
  }'
```

### Analytics

**Get Quiz Analytics** (GET)
```bash
curl http://localhost:5000/api/analytics/quiz/{quiz_id}
```

**Get Students for Option** (GET)
```bash
curl http://localhost:5000/api/analytics/quiz/{quiz_id}/question/{question_id}/option/B
```

**Get Student Results** (GET)
```bash
curl http://localhost:5000/api/analytics/student/{student_id}
```

---

## 🧪 Testing with Postman

1. Download Postman: https://www.postman.com/downloads/
2. Create new collection "Flashcard Quiz API"
3. Add requests using curl examples above
4. Test each endpoint
5. Verify MongoDB data:
   ```bash
   # Connect to MongoDB
   mongosh
   
   # Select database
   use flashcard-quiz
   
   # View collections
   show collections
   
   # View sample quiz
   db.quizzes.findOne()
   
   # View sample responses
   db.responses.findOne()
   ```

---

## 📝 Project Structure
```
backend/
├── server.js                    # Main server file
├── config/
│   └── database.js             # MongoDB configuration
├── models/
│   ├── Quiz.js                 # Quiz schema
│   └── Response.js             # Response schema
├── routes/
│   ├── quizzes.js             # Quiz endpoints
│   ├── responses.js           # Response endpoints
│   └── analytics.js           # Analytics endpoints
├── middleware/
│   └── errorHandler.js        # Error handling
├── utils/
│   └── validation.js          # Input validation
├── package.json               # Dependencies
├── .env                       # Environment config
└── .env.example              # Example config
```

---

## 🔧 Troubleshooting

### MongoDB Connection Error
```
❌ MongoDB Connection Error
   Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution:** Make sure MongoDB is running
```bash
# Check if MongoDB is running
mongosh

# If not, start it
mongod
```

### Port Already in Use
```
❌ Error: listen EADDRINUSE: address already in use :::5000
```
**Solution:** Change port in `.env` or kill process
```bash
# Kill process on port 5000
lsof -i :5000 | grep LISTEN | awk '{print $2}' | xargs kill -9
```

### Invalid MongoDB URI
```
❌ MongoDB Connection Error
   Error: Invalid connection string
```
**Solution:** Check MongoDB URI format in `.env`
- Local: `mongodb://localhost:27017/flashcard-quiz`
- Atlas: `mongodb+srv://username:password@cluster.mongodb.net/flashcard-quiz`

---

## ✅ Next Steps

1. ✅ **Backend is ready!**
2. Test all API endpoints with Postman
3. Create sample quizzes in MongoDB
4. Move to **Phase 2: Frontend Setup** (React)

📖 See `IMPLEMENTATION_STEPS.md` for detailed guide
