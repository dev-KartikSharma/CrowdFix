import React, { useState } from 'react';
import { callGeminiApi } from '../services/geminiService.js';

const ReportPage = ({ user, onAddIssue }) => {
    const [category, setCategory] = useState('');
    const [description, setDescription] = useState('');
    const [address, setAddress] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isEnhancing, setIsEnhancing] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!category || !description) {
            setError("Category and description are required.");
            return;
        }

        setIsLoading(true);
        try {
            const newIssueData = {
                category,
                description,
                address,
                reporter: user.email, 
                upvotes: 0,
                status: "submitted",
                timestamp: new Date(),
            };
            console.log("Submitting new issue:", newIssueData);
            const response = await fetch('http://localhost:8000/api/issues', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newIssueData),
            });

            if (!response.ok) {
                
                let errorMessage = "Failed to submit the issue.";
                try {
                    const errorData = await response.json();
                    errorMessage = errorData.detail || errorMessage;
                } catch {
                    const textError = await response.text();
                    if (textError) errorMessage = textError;
                }
                throw new Error(errorMessage);
            }

            let data = null;
            try {
                data = await response.json();
            } catch {
                data = { message: await response.text() };
            }

            setSuccess(data.message || "Issue reported successfully! Redirecting...");

            
            setTimeout(() => {
                onAddIssue(newIssueData);
            }, 2000);

        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleEnhanceDescription = async () => {
        if (!description) {
            setError("Please enter a description first.");
            return;
        }
        setIsEnhancing(true);
        setError('');
        const prompt = `Rewrite and enhance the following civic issue description to be more clear, formal, and detailed for an official government report. Do not add any new facts, just improve the language and structure. Original description: "${description}"`;
        try {
            const enhancedDescription = await callGeminiApi(prompt);
            setDescription(enhancedDescription);
        } catch (apiError) {
            setError('Failed to enhance description with AI.');
        } finally {
            setIsEnhancing(false);
        }
    };

    return (
        <div className="bg-white border-2 rounded-lg shadow-lg p-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Report a Civic Issue</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700">Issue Category *</label>
                    <select 
                        id="category" 
                        required 
                        value={category} 
                        onChange={e => setCategory(e.target.value)} 
                        className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-black focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    >
                        <option value="">Select a category</option>
                        <option value="Pothole">Pothole</option>
                        <option value="Garbage">Garbage Dump</option>
                        <option value="Streetlight Outage">Streetlight Outage</option>
                        <option value="Other">Other</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description *</label>
                    <textarea 
                        id="description" 
                        rows="4" 
                        required 
                        value={description} 
                        onChange={e => setDescription(e.target.value)} 
                        placeholder="Provide a detailed description..." 
                        className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-black focus:outline-none focus:ring-indigo-500"
                    ></textarea>
                    <button 
                        type="button" 
                        onClick={handleEnhanceDescription} 
                        disabled={isEnhancing || isLoading} 
                        className="mt-2 w-full text-sm text-indigo-600 hover:text-indigo-800 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isEnhancing ? 'Enhancing...' : '✨ Enhance Description with AI'}
                    </button>
                </div>
                <div>
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address / Landmark</label>
                    <input 
                        id="address" 
                        type="text" 
                        value={address} 
                        onChange={e => setAddress(e.target.value)} 
                        placeholder="e.g., Near City Park" 
                        className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-black focus:outline-none focus:ring-indigo-500"
                    />
                </div>
                
                {error && <p className="text-sm text-red-600 text-center">{error}</p>}
                {success && <p className="text-sm text-green-600 text-center">{success}</p>}

                <div className="flex justify-end pt-4">
                    <button 
                        type="submit" 
                        disabled={isLoading} 
                        className="inline-flex justify-center items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400"
                    >
                        {isLoading ? 'Submitting...' : 'Submit Report'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ReportPage;

