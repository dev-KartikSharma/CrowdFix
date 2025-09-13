import React, { useState } from 'react';
// Import from file 2: Adds Google Maps capabilities
import { APIProvider } from '@vis.gl/react-google-maps';

import AuthPage from './components/AuthPage.js';
import ReportPage from './components/ReportPage.js';
import ViewIssuesPage from './components/ViewIssuesPage.js';

// Merged initial issues: Includes address from file 1 and geotag from file 2
const initialIssues = [
    { 
        id: '1', 
        reporterEmail: 'test1@example.com', 
        category: 'pothole', 
        description: 'Large pothole on Elm Street.', 
        address: 'Near the park', // Kept from file 1
        upvotes: 15, 
        status: 'submitted', 
        timestamp: new Date(),
        geotag: { latitude: 28.6139, longitude: 77.2090 } // Added from file 2
    },
    { 
        id: '2', 
        reporterEmail: 'test2@example.com', 
        category: 'garbage', 
        description: 'Overflowing trash can.', 
        address: 'Main St corner', // Kept from file 1
        upvotes: 8, 
        status: 'in-progress', 
        timestamp: new Date(),
        geotag: { latitude: 28.6562, longitude: 77.2410 } // Added from file 2
    },
];

export default function App() {
    // State and logic from file 1
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

    // JSX from file 1, wrapped with APIProvider from file 2
    return (
        <APIProvider apiKey="AIzaSyCQvSPkJN1y0wLltjQhiTp0lP00zLwX5Yo">
            <div className="bg-gray-100 min-h-screen"> 
                <nav className="bg-gray-200 shadow-sm sticky top-0 z-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center py-4">
                            {/* Navbar layout and styling from file 1 */}
                            <div className="flex items-baseline space-x-4">
                                <h1 className="text-2xl font-bold text-black">CrowdFix</h1>
                                <p className="font text-black">Community Issue Reporting</p>
                            </div>
                            <div className="flex items-center space-x-4">
                                {/* Button components and styling from file 1 */}
                                <button 
                                    onClick={() => setPage('view')} 
                                    className={`px-3 py-1 rounded-md text-sm font-medium ${page === 'view' ? 'bg-black text-white' : 'bg-white text-black'}`}
                                >
                                    View Issues
                                </button>
                                <button 
                                    onClick={() => setPage('report')} 
                                    className={`px-3 py-1 rounded-md text-sm font-medium ${page === 'report' ? 'bg-black text-white' : 'bg-white text-black'}`}
                                >
                                    Report Issue
                                </button>
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
        </APIProvider>
    );
}
