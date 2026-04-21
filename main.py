
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import sqlite3
import os

app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


def get_db():
    conn = sqlite3.connect("leetcode.db")
    # Return rows as dictionaries instead of tuples
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    conn = get_db()
    conn.execute("""
        CREATE TABLE IF NOT EXISTS problems (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            difficulty TEXT NOT NULL,
            category TEXT NOT NULL,
            url TEXT,
            notes TEXT,
            solution TEXT,
            solved INTEGER DEFAULT 0,
            date_added TEXT
        )
    """)
    conn.execute("""
        CREATE TABLE IF NOT EXISTS patterns (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            topic TEXT NOT NULL,
            description TEXT,
            template TEXT,
            date_added TEXT
        )
    """)
    conn.commit()
    conn.close()


init_db()


class Problem(BaseModel):
    name: str
    difficulty: str
    category: str
    url: Optional[str] = None
    notes: Optional[str] = None
    solution: Optional[str] = None
    solved: Optional[int] = 0
    date_added: Optional[str] = None


class Pattern(BaseModel):
    topic: str
    description: Optional[str] = None
    template: Optional[str] = None
    date_added: Optional[str] = None


@app.get("/problems")
def get_problems():
    conn = get_db()
    problems = conn.execute("SELECT * FROM problems").fetchall()
    conn.close()
    return [dict(p) for p in problems]


@app.post("/problems")
def add_problem(problem: Problem):
    conn = get_db()
    conn.execute("""
        INSERT INTO problems (name, difficulty, category, url, notes, solution, solved, date_added)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    """, (problem.name, problem.difficulty, problem.category, problem.url,
          problem.notes, problem.solution, problem.solved, problem.date_added))
    conn.commit()
    conn.close()
    return {"message": "Problem added successfully"}


@app.delete("/problems/{problem_id}")
def delete_problem(problem_id: int):
    conn = get_db()
    conn.execute("DELETE FROM problems WHERE id = ?", (problem_id,))
    conn.commit()
    conn.close()
    return {"message": "Problem deleted successfully"}

@app.get("/patterns")
def get_patterns():
    conn = get_db()
    patterns = conn.execute("SELECT * FROM patterns").fetchall()
    conn.close()
    return [dict(p) for p in patterns]


@app.post("/patterns")
def add_pattern(pattern: Pattern):
    conn = get_db()
    conn.execute("""
        INSERT INTO patterns (topic, description, template, date_added)
        VALUES (?, ?, ?, ?)
    """, (pattern.topic, pattern.description, pattern.template, pattern.date_added))
    conn.commit()
    conn.close()
    return {"message": "Pattern added successfully"}

@app.delete("/patterns/{pattern_id}")
def delete_pattern(pattern_id: int):
    conn = get_db()
    conn.execute("DELETE FROM patterns WHERE id = ?", (pattern_id,))
    conn.commit()
    conn.close()
    return {"message": "Pattern deleted successfully"}