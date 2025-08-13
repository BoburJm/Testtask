# IELTS Mock Exam — Mini Platform

A tiny, clean full‑stack app that lets you take a short IELTS‑style multiple‑choice test with a 10‑minute timer, then see your score and review which answers were right/wrong. Includes a super simple admin to add/edit/delete questions.

## How to run 
1) Start the API
```bat
cd Technical_Assignment\server
npm i
npm run seed
npm run dev
```
API: http://localhost:4000

2) Start the frontend
```bat
cd ..\client
npm i
npm run dev
```
App: http://localhost:5173

## Where to click
- Test page: `http://localhost:5173/`
  - Answer questions, watch the 10‑minute countdown, submit.
  - Results show total correct, percentage, and a review of your choices vs correct answers.
- Admin: `http://localhost:5173/admin`
  - Add a question: text + 4 options, pick exactly one correct.
  - Edit/Delete existing questions.

## Requirements
- Node 18+ (or 20+)
- MongoDB listening on `mongodb://localhost:27017`
 env (`Technical_Assignment\server\.env`):
```
MONGO_URI=mongodb://127.0.0.1:27017/ielts_mock
PORT=4000
```

## API (with examples)
Base: `http://localhost:4000`

### List questions
GET `/api/questions`
Response 200:
```json
[
  {
    "_id": "66bc...e1",
    "text": "What is the capital of England?",
    "options": [
      { "text": "Manchester", "isCorrect": false },
      { "text": "London", "isCorrect": true },
      { "text": "Birmingham", "isCorrect": false },
      { "text": "Liverpool", "isCorrect": false }
    ],
    "createdAt": "2025-08-08T10:00:00.000Z",
    "updatedAt": "2025-08-08T10:00:00.000Z"
  }
]
```

### Get one question
GET `/api/questions/:id`
Response 200:
```json
{
  "_id": "66bc...e1",
  "text": "What is the capital of England?",
  "options": [
    { "text": "Manchester", "isCorrect": false },
    { "text": "London", "isCorrect": true },
    { "text": "Birmingham", "isCorrect": false },
    { "text": "Liverpool", "isCorrect": false }
  ],
  "createdAt": "2025-08-08T10:00:00.000Z",
  "updatedAt": "2025-08-08T10:00:00.000Z"
}
```

### Create question
POST `/api/questions`
Request body:
```json
{
  "text": "2 + 2 = ?",
  "options": [
    { "text": "3", "isCorrect": false },
    { "text": "4", "isCorrect": true },
    { "text": "5", "isCorrect": false },
    { "text": "22", "isCorrect": false }
  ]
}
```
Response 201:
```json
{
  "_id": "66bd...a9",
  "text": "2 + 2 = ?",
  "options": [
    { "text": "3", "isCorrect": false },
    { "text": "4", "isCorrect": true },
    { "text": "5", "isCorrect": false },
    { "text": "22", "isCorrect": false }
  ],
  "createdAt": "2025-08-08T10:05:00.000Z",
  "updatedAt": "2025-08-08T10:05:00.000Z"
}
```

### Update question
PUT `/api/questions/:id`
Request body (any of `text`, `options`):
```json
{ "text": "2 + 2 = ?" }
```
Response 200: updated question (same shape as GET one).

### Delete question
DELETE `/api/questions/:id`
Response 200:
```json
{ "ok": true }
```

Rules: exactly 4 options; exactly one `isCorrect=true`.

### Start test
GET `/api/test/start?random=true`
Response 200:
```json
{
  "questions": [
    {
      "id": "66bc...e1",
      "text": "What is the capital of England?",
      "options": [
        { "index": 0, "text": "Manchester" },
        { "index": 1, "text": "London" },
        { "index": 2, "text": "Birmingham" },
        { "index": 3, "text": "Liverpool" }
      ]
    }
  ]
}
```

### Submit test
POST `/api/test/submit`
Request body:
```json
{
  "answers": [ { "id": "66bc...e1", "selectedIndex": 1 } ]
}
```
Response 200:
```json
{
  "total": 1,
  "correct": 1,
  "percent": 100,
  "details": [
    {
      "id": "66bc...e1",
      "text": "What is the capital of England?",
      "options": [
        { "index": 0, "text": "Manchester" },
        { "index": 1, "text": "London" },
        { "index": 2, "text": "Birmingham" },
        { "index": 3, "text": "Liverpool" }
      ],
      "selectedIndex": 1,
      "correctIndex": 1,
      "correct": true
    }
  ]
}
```

For a deeper description , see `PROJECT_OVERVIEW.md`.
