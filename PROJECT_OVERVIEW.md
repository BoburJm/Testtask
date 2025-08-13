# Project Overview

This project is a minimal IELTS mock exam platform with:
- A backend API (Node + Express + Mongoose) that stores questions and scores submissions
- A frontend (React + Vite) that lets users take a timed test and view results
- A tiny admin UI to manage questions

## What it does
- Admin can create, read, update, and delete questions.
  - Each question has: `text` and exactly 4 options, with exactly one marked as correct.
- Users can start a test, randomly ordered.
- A 10‑minute countdown runs during the test.
- Users select answers and submit.
- The server scores the test and the UI shows:
  - Correct count and percentage
  - A review per question showing the correct answer and the user’s choice

## Tech
- Backend: Node 18+, Express, Mongoose, MongoDB
- Frontend: React 18, Vite

## Running locally (Windows CMD)
1) API
```bat
cd Technical_Assignment\server
npm i
npm run seed
npm run dev
```
2) Frontend
```bat
cd ..\client
npm i
npm run dev
```

## API
Base URL: `http://localhost:4000`

### Questions (Admin CRUD)
- GET `/api/questions`
  - List all questions.
- GET `/api/questions/:id`
  - Get one question by id.
- POST `/api/questions`
  - Create a new question.
  - Body:
```json
{ "text": "2 + 2 = ?", "options": [
  { "text": "3", "isCorrect": false },
  { "text": "4", "isCorrect": true },
  { "text": "5", "isCorrect": false },
  { "text": "22", "isCorrect": false }
] }
```
- PUT `/api/questions/:id`
  - Update `text` and/or `options`.
- DELETE `/api/questions/:id`
  - Delete question.

Validation rules:
- Exactly 4 options
- Exactly 1 option must have `isCorrect=true`

### Test
- GET `/api/test/start?random=true`
  - Returns questions without revealing correct answers.
  - Example response:
```json
{ "questions": [
  {
    "id": "66bc...",
    "text": "What is the capital of England?",
    "options": [
      { "index": 0, "text": "Manchester" },
      { "index": 1, "text": "London" },
      { "index": 2, "text": "Birmingham" },
      { "index": 3, "text": "Liverpool" }
    ]
  }
] }
```

- POST `/api/test/submit`
  - Body:
```json
{ "answers": [ { "id": "66bc...", "selectedIndex": 1 } ] }
```
  - Response:
```json
{
  "total": 1,
  "correct": 1,
  "percent": 100,
  "details": [
    {
      "id": "66bc...",
      "text": "What is the capital of England?",
      "options": [ { "index": 0, "text": "Manchester" }, { "index": 1, "text": "London" }, { "index": 2, "text": "Birmingham" }, { "index": 3, "text": "Liverpool" } ],
      "selectedIndex": 1,
      "correctIndex": 1,
      "correct": true
    }
  ]
}
```

## UI
- Test page: radio options, 10‑minute timer, progress bar, submit.
- Results page: score summary + per‑question review (correct vs chosen).
- Admin page: add/edit/delete questions with single‑correct enforcement.

## Database storage and configuration
The app connects to MongoDB via `MONGO_URI`. Where data is stored depends on your Mongo deployment.

- Local Docker (no auth):
```bat
docker run -d --name mongo -p 27017:27017 mongo:7
```
- Local Docker with persistent storage:
```bat
docker run -d --name mongo -p 27017:27017 -v D:\mongo-data:/data/db mongo:7
```
- Local Docker with auth:
```bat
docker run -d --name mongo -p 27017:27017 -e MONGO_INITDB_ROOT_USERNAME=root -e MONGO_INITDB_ROOT_PASSWORD=pass mongo:7
```
- Example `server/.env`:
```
MONGO_URI=mongodb://127.0.0.1:27017/ielts_mock
PORT=4000
```
If auth is enabled:
```
MONGO_URI=mongodb://root:pass@127.0.0.1:27017/ielts_mock?authSource=admin
```

The app itself is DB‑agnostic beyond the URI; switch to Atlas or a different host by changing `MONGO_URI`.
