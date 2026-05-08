# LeetCode Tracker

A full-stack study platform to track LeetCode problems and DSA patterns as you prep for technical interviews.

🔗 **Live Demo:** https://leetcode-tracker-delta-azure.vercel.app

## Features

- Add, view, and delete LeetCode problems with difficulty, category, notes, and solution links
- Track DSA patterns with descriptions and code templates
- Persistent storage via PostgreSQL on Render
- REST API with auto-generated docs at `/docs`

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React, deployed on Vercel |
| Backend | FastAPI (Python) |
| Database | SQLite / PostgreSQL on Render |

## Running Locally

### Backend
```bash
pip install fastapi uvicorn pydantic
uvicorn main:app --reload
```

### Frontend
```bash
cd frontend
npm install
npm start
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/problems` | Fetch all problems |
| POST | `/problems` | Add a new problem |
| DELETE | `/problems/{id}` | Delete a problem |
| GET | `/patterns` | Fetch all patterns |
| POST | `/patterns` | Add a new pattern |
| DELETE | `/patterns/{id}` | Delete a pattern |
