# Step-by-Step Implementation Guide

## Phase 1: Project Setup & Basic Infrastructure (Week 1)

### Step 1.1: Initialize Backend Environment
```bash
cd backend
npm install
npm install nodemon -D
```

**Files to Create:**
- `.env` - Environment variables
- `config/database.js` - MongoDB connection config
- `middleware/errorHandler.js` - Error handling middleware
- `middleware/auth.js` - Authentication middleware (optional for now)

### Step 1.2: Set Up MongoDB Locally
- Download MongoDB Community Edition
- Run MongoDB locally or use MongoDB Atlas (cloud)
- Update `.env` with connection string

### Step 1.3: Test Backend API
```bash
npm run dev  # Should start on http://localhost:5000
```

---

## Phase 2: Quiz Management System (Week 2)

### Step 2.1: Create Quiz API Routes
**File:** `backend/routes/quizzes.js`

**Endpoints:**
- `POST /api/quizzes` - Create quiz
- `GET /api/quizzes` - List all quizzes
- `GET /api/quizzes/:id` - Get single quiz
- `PUT /api/quizzes/:id` - Update quiz
- `DELETE /api/quizzes/:id` - Delete quiz
- `PATCH /api/quizzes/:id/status` - Change quiz status (draft → active → completed)

### Step 2.2: Create Quiz Admin Panel UI
**File:** `frontend/src/components/AdminPanel.jsx`

**Features:**
- Form to create new quiz
- Add/edit questions
- Upload question images
- Set time limit
- Start/end quiz

### Step 2.3: Test with Postman
- Create sample quiz via API
- Verify database storage
- Test update/delete operations

---

## Phase 3: Student Response Collection (Week 3)

### Step 3.1: Create Response API Routes
**File:** `backend/routes/responses.js`

**Endpoints:**
- `POST /api/responses` - Submit student response
- `GET /api/responses/quiz/:quizId` - Get all responses for quiz
- `GET /api/responses/:quizId/:studentId` - Get specific student responses

### Step 3.2: Create Student Quiz Interface
**File:** `frontend/src/components/StudentQuiz.jsx`

**Features:**
- Display current question
- Show options A, B, C, D (visual cards)
- Timer countdown
- Submit button for each option
- Auto-advance to next question

### Step 3.3: Integrate with Backend
```javascript
// When student selects option, send to backend
const submitResponse = async (studentId, questionId, selectedOption) => {
  await fetch('/api/responses', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      studentId,
      questionId,
      selectedOption,
      quizId: currentQuiz._id
    })
  });
};
```

---

## Phase 4: Image/Flash Card Detection (Week 4)

### Step 4.1: Set Up Computer Vision Library
```bash
cd frontend
npm install @tensorflow/tfjs @tensorflow/tfjs-coco-ssd
```

OR for simplicity:
```bash
npm install opencv.js
```

### Step 4.2: Create Detection Service
**File:** `frontend/src/services/cardDetection.js`

**Features:**
- Access camera via WebRTC
- Detect card region in frame
- Identify option letter (A/B/C/D)
- Return confidence score

### Step 4.3: Create Camera Component
**File:** `frontend/src/components/CameraFeed.jsx`

```javascript
import * as tf from '@tensorflow/tfjs';
import * as cocoSsd from '@tensorflow/tfjs-coco-ssd';

const detectCard = async (videoElement) => {
  const model = await cocoSsd.load();
  const predictions = await model.estimateObjects(videoElement);
  // Filter for flashcard objects (A, B, C, D)
  return predictions;
};
```

### Step 4.4: Integrate Detection with Quiz
```javascript
// Detect when flashcard is shown
const handleFrameCapture = async (frame) => {
  const detected = await detectCard(frame);
  if (detected.confidence > 0.8) {
    submitResponse(studentId, questionId, detected.option);
  }
};
```

---

## Phase 5: Analytics & Reporting (Week 5)

### Step 5.1: Analytics API Endpoints (Already Created)
Review `backend/routes/analytics.js`

**Endpoints:**
- `GET /api/analytics/quiz/:quizId` - Overall stats
- `GET /api/analytics/quiz/:quizId/question/:questionId/option/:option` - Students per option

### Step 5.2: Create Analytics Dashboard
**File:** `frontend/src/components/AnalyticsDashboard.jsx`

**Display:**
- Bar chart: Students per option
- Table: Students who selected each option
- Statistics: Accuracy, most selected option
- Export button: Download as CSV/PDF

### Step 5.3: Add Chart Library
```bash
npm install recharts
```

**Example:**
```javascript
import { BarChart, Bar, XAxis, YAxis } from 'recharts';

const AnalyticsChart = ({ data }) => (
  <BarChart data={data}>
    <XAxis dataKey="option" />
    <YAxis />
    <Bar dataKey="count" fill="#8884d8" />
  </BarChart>
);
```

---

## Phase 6: Integration & Testing (Week 6)

### Step 6.1: Connect All Components
- Admin creates quiz → Backend saves
- Students join quiz → Frontend fetches questions
- Camera detects cards → Sends response to backend
- Quiz ends → Analytics computed
- Dashboard shows results

### Step 6.2: End-to-End Testing
1. Create quiz with 5 questions
2. Set 2-minute time limit
3. Start quiz
4. Simulate student responses (or use camera)
5. Verify responses stored in DB
6. Check analytics dashboard
7. Export results

### Step 6.3: Handle Edge Cases
- Multiple students simultaneously
- Detection failures → Manual selection fallback
- Time limit reached → Auto-submit
- Lost connection → Resume capability

---

## File Creation Checklist

### Backend
- [ ] `.env` - Environment config
- [ ] `config/database.js` - DB connection
- [ ] `middleware/errorHandler.js` - Error handling
- [ ] `routes/quizzes.js` - Quiz CRUD
- [ ] `routes/responses.js` - Response submission
- [ ] `routes/analytics.js` - Stats/reports
- [ ] `controllers/quizController.js` - Business logic
- [ ] `controllers/analyticsController.js` - Analytics logic
- [ ] `utils/validation.js` - Input validation

### Frontend
- [ ] `components/AdminPanel.jsx` - Quiz creation
- [ ] `components/StudentQuiz.jsx` - Quiz interface
- [ ] `components/CameraFeed.jsx` - Camera & detection
- [ ] `components/AnalyticsDashboard.jsx` - Results display
- [ ] `services/cardDetection.js` - Detection logic
- [ ] `services/apiClient.js` - API calls
- [ ] `hooks/useQuiz.js` - Quiz state management
- [ ] `hooks/useAnalytics.js` - Analytics state
- [ ] `pages/AdminPage.jsx` - Admin page
- [ ] `pages/StudentPage.jsx` - Student page
- [ ] `pages/ResultsPage.jsx` - Results page

---

## Quick Start Commands

```bash
# Clone repo
git clone https://github.com/abhi2442-abel/flashcard-quiz-app.git
cd flashcard-quiz-app

# Backend setup
cd backend
npm install
npm run dev

# In new terminal - Frontend setup
cd frontend
npm create vite@latest . -- --template react
npm install
npm run dev

# Access
# Backend: http://localhost:5000
# Frontend: http://localhost:5173
```

---

## Estimated Timeline
- **Week 1:** Backend + DB setup
- **Week 2:** Quiz admin panel
- **Week 3:** Student interface + response storage
- **Week 4:** Camera + card detection
- **Week 5:** Analytics dashboard
- **Week 6:** Testing + refinement

**Total: 6 weeks to MVP**
