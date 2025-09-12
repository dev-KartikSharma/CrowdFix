# main.py - The entry point for our FastAPI backend.

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Create the FastAPI application instance
app = FastAPI()


origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Allows specific origins
    allow_credentials=True, # Allows cookies to be included in requests
    allow_methods=["*"],    # Allows all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],    # Allows all headers
)


# --- API Endpoints ---

@app.get("/")
def read_root():
    """A simple endpoint to check if the server is running."""
    return {"message": "CrowdFix Backend is running!"}


@app.get("/api/issues")
def get_issues():
    """
    A placeholder endpoint to send mock issue data to the frontend.
    This mimics what a real database query would return.
    """
    # This is the same mock data your React app is currently using.
    mock_issues = [
        {
            "id": 1,
            "category": "Pothole",
            "title": "Large pothole on Elm Street.",
            "description": "Near the park, very dangerous for cyclists.",
            "reporter": "test1@example.com",
            "date": "9/10/2025",
            "upvotes": 12,
            "status": "submitted"
        },
        {
            "id": 2,
            "category": "Garbage",
            "title": "Overflowing trash can.",
            "description": "Main St corner trash can hasn't been emptied in a week.",
            "reporter": "test2@example.com",
            "date": "9/10/2025",
            "upvotes": 5,
            "status": "in-progress"
        },
    ]
    return mock_issues
