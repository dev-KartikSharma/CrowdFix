import uvicorn
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import datetime

# --- Pydantic Models ---
# Defines the expected data shape for incoming requests

class UserSignup(BaseModel):
    username: str
    email: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

class User(BaseModel):
    username: str
    email: str

class IssueCreate(BaseModel):
    category: str
    description: str
    address: Optional[str] = None
    reporter: str

class Issue(BaseModel):
    id: int
    category: str
    title: str
    description: str
    address: Optional[str] = None
    reporter: str
    date: str
    upvotes: int
    status: str

# --- Mock Database ---
# These lists simulate real database tables for users and issues.

mock_users_db: List[User] = []
mock_issues_db: List[Issue] = [
    Issue(id=1, category="Pothole", title="Large pothole on Elm Street.", description="Near the park, very dangerous for cyclists.", address="Elm Street", reporter="test1", date=str(datetime.date(2025, 9, 10)), upvotes=12, status="submitted"),
    Issue(id=2, category="Garbage", title="Overflowing trash can.", description="Main St corner trash can hasn't been emptied in a week.", address="Main St", reporter="test2", date=str(datetime.date(2025, 9, 11)), upvotes=5, status="in-progress"),
]


# --- FastAPI App Setup ---
app = FastAPI()

# CORS Middleware: Allows the frontend (localhost:3000) to communicate with the backend (localhost:8000)
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

@app.post("/api/signup", status_code=201)
def create_user(user: UserSignup):
    print(f"--- New User Signup: {user.username} ---")
    # Check if user already exists
    if any(u.email == user.email for u in mock_users_db):
        raise HTTPException(status_code=400, detail="Email already registered")
    
    new_user = User(username=user.username, email=user.email)
    mock_users_db.append(new_user)
    # In a real app, you would hash the password here before saving
    return {"message": f"User '{user.username}' created successfully!", "user": new_user}

@app.post("/api/login")
def login_user(user: UserLogin):
    print(f"--- User Login Attempt: {user.email} ---")
    # Find user in our mock database
    db_user = next((u for u in mock_users_db if u.email == user.email), None)
    
    # In a real app, you would check the password hash
    if db_user:
        return {"message": "Login successful!", "user": db_user}
    
    raise HTTPException(status_code=401, detail="Invalid email or password")

@app.get("/api/issues", response_model=List[Issue])
def get_issues():
    print("--- Fetching all issues ---")
    return mock_issues_db

@app.post("/api/issues", response_model=Issue, status_code=201)
def create_issue(issue: IssueCreate):
    print(f"--- Creating new issue: {issue.category} ---")
    new_id = max(i.id for i in mock_issues_db) + 1 if mock_issues_db else 1
    new_issue = Issue(
        id=new_id,
        category=issue.category,
        title=f"New '{issue.category}' issue", # Title generated for simplicity
        description=issue.description,
        address=issue.address,
        reporter=issue.reporter,
        date=str(datetime.date.today()),
        upvotes=0,
        status="submitted"
    )
    mock_issues_db.append(new_issue)
    return new_issue

@app.put("/api/issues/{issue_id}/upvote", response_model=Issue)
def upvote_issue(issue_id: int):
    print(f"--- Upvoting issue ID: {issue_id} ---")
    for issue in mock_issues_db:
        if issue.id == issue_id:
            issue.upvotes += 1
            return issue
    raise HTTPException(status_code=404, detail="Issue not found")

if __name__ == "__main__":
    uvicorn.run(app, port=8000)