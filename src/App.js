import React, { useState } from 'react';
import AuthPage from './components/AuthPage.js';
import ReportPage from './components/ReportPage.js';
import ViewIssuesPage from './components/ViewIssuesPage.js';

// --- Initial Mock Data for Frontend Simulation ---
const initialIssues = [
    { id: '1', reporterEmail: 'test1@example.com', category: 'pothole', description: 'Large pothole on Elm Street.', address: 'Near the park', upvotes: 15, status: 'submitted', timestamp: new Date() },
    { id: '2', reporterEmail: 'test2@example.com', category: 'garbage', description: 'Overflowing trash can.', address: 'Main St corner', upvotes: 8, status: 'in-progress', timestamp: new Date() },
];

// --- Main App Component ---
// This is now the "conductor" of your application.
export default function App() {
    const [page, setPage] = useState('auth'); 
    const [user, setUser] = useState(null);
    const [issues, setIssues] = useState(initialIssues);

    const handleLogin = (loggedInUser) => {
        setUser(loggedInUser);
        setPage('view'); 
    };

    const handleLogout = () => {
        setUser(null);
        setPage('auth'); 
    };
    
    const handleAddIssue = (newIssue) => {
        setIssues([newIssue, ...issues].sort((a, b) => b.upvotes - a.upvotes));
        setPage('view'); 
    };
    
    const handleUpvote = (issueId) => {
        setIssues(issues.map(issue => 
            issue.id === issueId ? { ...issue, upvotes: issue.upvotes + 1 } : issue
        ).sort((a, b) => b.upvotes - a.upvotes));
    };

    if (!user) {
        return <AuthPage onLogin={handleLogin} />;
    }

    return (
        <div className="bg-gray-900 text-white min-h-screen">
            <nav className="bg-gray-800 shadow-sm sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-4">
                        <h1 className="text-2xl font-bold text-white">CrowdFix</h1>
                        <div className="flex items-center space-x-4">
                            <button onClick={() => setPage('view')} className={`px-3 py-1 rounded-md text-sm font-medium ${page === 'view' ? 'bg-indigo-600' : ''}`}>View Issues</button>
                             <button onClick={() => setPage('report')} className={`px-3 py-1 rounded-md text-sm font-medium ${page === 'report' ? 'bg-indigo-600' : ''}`}>Report Issue</button>
                            <button onClick={handleLogout} className="text-red-500 hover:text-red-400 font-medium">Logout</button>
                        </div>
                    </div>
                </div>
            </nav>
            <main>
                {page === 'report' && <div className="max-w-3xl mx-auto p-8"><ReportPage onAddIssue={handleAddIssue} user={user} /></div>}
                {page === 'view' && <ViewIssuesPage issues={issues} onUpvote={handleUpvote} />}
            </main>
        </div>
    );
}

