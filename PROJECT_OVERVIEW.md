# Flashcard Quiz App for Visual Recognition

## Overview
A web-based quiz application that displays flashcard options (A, B, C, D) printed on physical A4 cards. The system detects which option students select and stores their responses for analytics.

## Core Features

### 1. Quiz Management
- Create and manage quizzes with multiple questions
- Set time limits for quizzes
- Define answer options (A, B, C, D)
- Upload questions and media

### 2. Image Detection
- Computer vision to detect which flashcard option (A, B, C, D) is shown
- Camera input to capture student selections
- Real-time detection feedback

### 3. Student Response Tracking
- Record which option each student selected
- Timestamp each response
- Track response accuracy against correct answers

### 4. Analytics & Reports
- Show number of students who chose each option
- List students by selected option
- Generate statistics (pass rate, most selected option, etc.)
- Export data for further analysis

## Tech Stack
- **Frontend**: React/Vue.js for UI
- **Backend**: Node.js/Express or Python/Flask
- **Database**: MongoDB or PostgreSQL for response storage
- **Computer Vision**: OpenCV or TensorFlow.js for flashcard detection
- **Real-time**: WebSockets for live updates

## Project Structure
```
flashcard-quiz-app/
├── frontend/              # React/Vue frontend
├── backend/               # Express/Flask API
├── models/                # ML models for detection
├── docs/                  # Documentation
└── tests/                 # Test suite
```
