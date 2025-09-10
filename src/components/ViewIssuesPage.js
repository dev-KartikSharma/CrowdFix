import React, { useState } from 'react';
import Modal from './Modal';
import { callGeminiApi } from '../services/geminiService';

const ViewIssuesPage = ({ issues, onUpvote }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState('');
    const [modalTitle, setModalTitle] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSummarize = async () => {
        setIsLoading(true);
        const issuesText = issues.map(i => `- ${i.description} at ${i.address} (${i.category})`).join("\n");
        const prompt = `Provide a concise, one-paragraph summary of the following civic issues reported in the community:\n\n${issuesText}`;
        const summary = await callGeminiApi(prompt);
        setModalTitle("AI Summary of Issues");
        setModalContent(summary);
        setIsModalOpen(true);
        setIsLoading(false);
    };
    
    const handleDraftComplaint = async (issue) => {
        setIsLoading(true);
        const prompt = `Draft a formal but polite complaint email to the local municipal corporation regarding the following civic issue. The email should be ready to be copied and sent.\n\nIssue Category: ${issue.category}\nDescription: ${issue.description}\nLocation: ${issue.address}`;
        const draft = await callGeminiApi(prompt);
        setModalTitle(`Draft Complaint: ${issue.category}`);
        setModalContent(draft);
        setIsModalOpen(true);
        setIsLoading(false);
    };


    return (
        <div className="p-8">
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={modalTitle}>{modalContent}</Modal>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-white">Community Issues</h2>
                <button onClick={handleSummarize} disabled={isLoading} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50">
                    {isLoading && modalTitle === "AI Summary of Issues" ? 'Summarizing...' : '✨ Get AI Summary'}
                </button>
            </div>
            {issues.length === 0 ? (
                <p className="text-gray-400">No issues reported yet.</p>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {issues.map(issue => (
                        <div key={issue.id} className="bg-gray-800 rounded-lg shadow p-5 flex flex-col justify-between">
                            <div>
                                <span className="inline-block bg-indigo-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full uppercase">{issue.category}</span>
                                <h3 className="text-lg font-semibold text-white mt-3">{issue.description}</h3>
                                <p className="text-sm text-gray-400 mt-1">{issue.address}</p>
                                 <div className="text-xs text-gray-500 pt-3 mt-3 border-t border-gray-700">
                                    Reported by {issue.reporterEmail}
                                </div>
                            </div>
                            <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-700">
                                <button onClick={() => onUpvote(issue.id)} className="flex items-center text-sm font-medium text-gray-300 hover:text-white">
                                    <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7"></path></svg>
                                    {issue.upvotes} Upvotes
                                </button>
                                <button onClick={() => handleDraftComplaint(issue)} disabled={isLoading && modalTitle.includes(issue.category)} className="text-sm text-indigo-400 hover:text-indigo-300 disabled:opacity-50">
                                    ✨ Draft Complaint
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ViewIssuesPage;
