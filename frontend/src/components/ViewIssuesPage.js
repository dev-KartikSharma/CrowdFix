import React, { useState } from 'react';
import { callGeminiApi } from '../services/geminiService.js';
import Modal from './Modal.js';
import IssuesMapView from './IssuesMapView';

const ViewIssuesPage = ({ issues, onUpvote, isLoadingIssues }) => {
    const [modalContent, setModalContent] = useState(null);
    const [modalTitle, setModalTitle] = useState('');
    const [isAiLoading, setIsAiLoading] = useState(false);
    // State to toggle between list and map view (from file 2)
    const [viewMode, setViewMode] = useState('list');

    // AI logic from file 1 (uses address)
    const handleSummarize = async () => {
        setIsAiLoading(true);
        setModalTitle("AI Summary of Issues");
        const issuesText = issues.map(i => `- ${i.category}: ${i.description} at ${i.address}`).join('\n');
        const prompt = `Summarize these civic issues:\n${issuesText}`;
        const summary = await callGeminiApi(prompt);
        setModalContent(summary);
        setIsAiLoading(false);
    };

    // AI logic from file 1 (uses address)
    const handleDraftComplaint = async (issue) => {
        setIsAiLoading(true);
        setModalTitle(`Draft Complaint for Issue #${issue.id}`);
        const prompt = `Draft a formal complaint email for this issue: ${issue.category} - "${issue.description}" at ${issue.address}.`;
        const draft = await callGeminiApi(prompt);
        setModalContent(draft);
        setIsAiLoading(false);
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex justify-between items-center mb-6">
                {/* Title styling from file 1 */}
                <h2 className="text-3xl font-bold text-black">Community Issues</h2>
                <div className="flex items-center space-x-4">
                    {/* Button styling from file 1 */}
                    <button onClick={handleSummarize} disabled={isAiLoading || !issues.length} className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 disabled:opacity-50">
                        {isAiLoading && modalTitle.includes("Summary") ? 'Summarizing...' : '✨ Get AI Summary'}
                    </button>
                    {/* Map toggle button from file 2, with styling matched to file 1 */}
                    <button onClick={() => setViewMode(viewMode === 'list' ? 'map' : 'list')} className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800">
                        {viewMode === 'list' ? '🗺 Map View' : '📄 List View'}
                    </button>
                </div>
            </div>

            {isLoadingIssues ? (
                <p className="text-center text-black-400">Loading issues...</p>
            ) : issues.length === 0 ? (
                <p className="text-center text-gray-400">No issues reported yet.</p>
            ) : (
                viewMode === 'list' ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {issues.map(issue => (
                            // Issue tile styling from file 1
                            <div key={issue.id} className="bg-gray-800 rounded-lg shadow p-6 flex flex-col justify-between">
                                <div>
                                    {/* Category tag styling from file 1 */}
                                    <span className="inline-block bg-black text-white text-xs font-semibold px-2 py-1 rounded-full uppercase mb-2">{issue.category}</span>
                                    <h3 className="text-xl font-bold text-white mb-2">{issue.description}</h3>
                                    <p className="text-gray-400 mb-4">{issue.address}</p>
                                </div>
                                <div>
                                    <div className="border-t border-gray-700 my-4"></div>
                                    <div className="flex justify-between items-center text-sm text-gray-500">
                                        <span>{issue.reporter_email}</span>
                                        <span>{new Date(issue.timestamp).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex justify-between items-center mt-4">
                                        <button onClick={() => onUpvote(issue.id)} className="flex items-center space-x-2 text-gray-400 hover:text-white">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>
                                            <span>{issue.upvotes} Upvotes</span>
                                        </button>
                                        <button onClick={() => handleDraftComplaint(issue)} disabled={isAiLoading} className="text-indigo-400 hover:text-indigo-300 text-sm disabled:opacity-50">
                                            ✨ Draft Complaint
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <IssuesMapView issues={issues} />
                )
            )}
            
            {(isAiLoading || modalContent) && (
                <Modal
                    title={modalTitle}
                    content={isAiLoading && !modalContent ? "AI is thinking..." : modalContent}
                    onClose={() => setModalContent(null)}
                />
            )}
        </div>
    );
};

export default ViewIssuesPage;