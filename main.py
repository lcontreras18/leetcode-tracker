from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

DATABASE_URL = os.environ.get("DATABASE_URL")

def get_db():
    if DATABASE_URL:
        import psycopg2
        import psycopg2.extras
        conn = psycopg2.connect(DATABASE_URL)
        return conn, True  # True = postgres
    else:
        import sqlite3
        conn = sqlite3.connect("leetcode.db")
        conn.row_factory = sqlite3.Row
        return conn, False  # False = sqlite

def init_db():
    conn, is_postgres = get_db()
    cur = conn.cursor()
    placeholder = "%s" if is_postgres else "?"
    cur.execute("""
        CREATE TABLE IF NOT EXISTS problems (
            id SERIAL PRIMARY KEY,
            name TEXT NOT NULL,
            difficulty TEXT NOT NULL,
            category TEXT NOT NULL,
            url TEXT,
            notes TEXT,
            solution TEXT,
            solved INTEGER DEFAULT 0,
            date_added TEXT
        )
    """ if is_postgres else """
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
    cur.execute("""
        CREATE TABLE IF NOT EXISTS patterns (
            id SERIAL PRIMARY KEY,
            topic TEXT NOT NULL,
            description TEXT,
            template TEXT,
            date_added TEXT
        )
    """ if is_postgres else """
        CREATE TABLE IF NOT EXISTS patterns (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            topic TEXT NOT NULL,
            description TEXT,
            template TEXT,
            date_added TEXT
        )
    """)
    conn.commit()
    cur.close()
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
    conn, is_postgres = get_db()
    cur = conn.cursor()
    cur.execute("SELECT * FROM problems")
    rows = cur.fetchall()
    columns = [desc[0] for desc in cur.description]
    cur.close()
    conn.close()
    return [dict(zip(columns, row)) for row in rows]

@app.post("/problems")
def add_problem(problem: Problem):
    conn, is_postgres = get_db()
    cur = conn.cursor()
    ph = "%s" if is_postgres else "?"
    cur.execute(f"""
        INSERT INTO problems (name, difficulty, category, url, notes, solution, solved, date_added)
        VALUES ({ph},{ph},{ph},{ph},{ph},{ph},{ph},{ph})
    """, (problem.name, problem.difficulty, problem.category, problem.url,
          problem.notes, problem.solution, problem.solved, problem.date_added))
    conn.commit()
    cur.close()
    conn.close()
    return {"message": "Problem added successfully"}

@app.delete("/problems/{problem_id}")
def delete_problem(problem_id: int):
    conn, is_postgres = get_db()
    cur = conn.cursor()
    ph = "%s" if is_postgres else "?"
    cur.execute(f"DELETE FROM problems WHERE id = {ph}", (problem_id,))
    conn.commit()
    cur.close()
    conn.close()
    return {"message": "Problem deleted successfully"}

@app.get("/patterns")
def get_patterns():
    conn, is_postgres = get_db()
    cur = conn.cursor()
    cur.execute("SELECT * FROM patterns")
    rows = cur.fetchall()
    columns = [desc[0] for desc in cur.description]
    cur.close()
    conn.close()
    return [dict(zip(columns, row)) for row in rows]

@app.post("/patterns")
def add_pattern(pattern: Pattern):
    conn, is_postgres = get_db()
    cur = conn.cursor()
    ph = "%s" if is_postgres else "?"
    cur.execute(f"""
        INSERT INTO patterns (topic, description, template, date_added)
        VALUES ({ph},{ph},{ph},{ph})
    """, (pattern.topic, pattern.description, pattern.template, pattern.date_added))
    conn.commit()
    cur.close()
    conn.close()
    return {"message": "Pattern added successfully"}

@app.delete("/patterns/{pattern_id}")
def delete_pattern(pattern_id: int):
    conn, is_postgres = get_db()
    cur = conn.cursor()
    ph = "%s" if is_postgres else "?"
    cur.execute(f"DELETE FROM patterns WHERE id = {ph}", (pattern_id,))
    conn.commit()
    cur.close()
    conn.close()
    return {"message": "Pattern deleted successfully"}
