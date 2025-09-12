import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional

# --- Pydantic Models ---
class UserSignup(BaseModel):
    username: str
    email: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

class Issue(BaseModel):
    id: int
    category: str
    title: str
    description: str
    reporter: str
    date: str
    upvotes: int
    status: str

class IssueCreate(BaseModel):
    category: str
    description: str
    address: Optional[str] = None
    
# --- Mock Database ---
# This list simulates a real database. We'll modify this list directly.
mock_db: List[Issue] = [
    Issue(id=1, category="Pothole", title="Large pothole on Elm Street.", description="Near the park, very dangerous for cyclists.", reporter="test1@example.com", date="9/10/2025", upvotes=12, status="submitted"),
    Issue(id=2, category="Garbage", title="Overflowing trash can.", description="Main St corner trash can hasn't been emptied in a week.", reporter="test2@example.com", date="9/10/2025", upvotes=5, status="in-progress"),
]

# --- FastAPI App ---
app = FastAPI()

origins = ["http://localhost:3000"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- API Endpoints ---
@app.get("/")
def read_root():
    return {"message": "CrowdFix Backend is running!"}

@app.post("/api/signup")
def create_user(user: UserSignup):
    print(f"--- New User Signup: {user.username} ---")
    return {"message": f"User '{user.username}' created successfully!"}

@app.post("/api/login")
def login_user(user: UserLogin):
    print(f"--- User Login Attempt: {user.email} ---")
    # In a real app, you'd check password hash against a database.
    return {"message": "Login successful!", "user": {"email": user.email}}

@app.get("/api/issues", response_model=List[Issue])
def get_issues():
    print("--- Fetching all issues ---")
    return mock_db

@app.post("/api/issues", response_model=Issue)
def create_issue(issue: IssueCreate):
    print(f"--- Creating new issue: {issue.category} ---")
    new_id = max(i.id for i in mock_db) + 1 if mock_db else 1
    new_issue = Issue(
        id=new_id,
        category=issue.category,
        title=f"New '{issue.category}' issue", # Title generated for simplicity
        description=issue.description,
        reporter="newuser@example.com", # Placeholder
        date="9/12/2025", # Placeholder
        upvotes=0,
        status="submitted"
    )
    mock_db.append(new_issue)
    return new_issue

@app.put("/api/issues/{issue_id}/upvote", response_model=Issue)
def upvote_issue(issue_id: int):
    print(f"--- Upvoting issue ID: {issue_id} ---")
    for issue in mock_db:
        if issue.id == issue_id:
            issue.upvotes += 1
            return issue
    return {"error": "Issue not found"}, 404

