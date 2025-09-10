import React, { useState } from 'react';
import { callGeminiApi } from '../services/geminiService.js';

const ReportPage = ({ onAddIssue, user }) => {
    const [category, setCategory] = useState('');
    const [description, setDescription] = useState('');
    const [address, setAddress] = useState('');
    const [isEnhancing, setIsEnhancing] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!category || !description || !address) return;
        const newIssue = {
            id: 'id-' + Math.random(),
            reporterEmail: user.email,
            category,
            description,
            address,
            upvotes: 0,
            status: 'submitted',
            timestamp: new Date()
        };
        onAddIssue(newIssue);
        setCategory(''); setDescription(''); setAddress('');
        alert("Issue reported successfully!");
    };
    
    const handleEnhanceDescription = async () => {
        if (!description) {
            alert("Please enter a description first.");
            return;
        }
        setIsEnhancing(true);
        const prompt = `Rewrite and enhance the following civic issue description to be more clear, formal, and detailed for an official government report. Do not add any new facts, just improve the language and structure. Original description: "${description}"`;
        const enhancedDescription = await callGeminiApi(prompt);
        setDescription(enhancedDescription);
        setIsEnhancing(false);
    };

    return (
         <div className="bg-gray-800 rounded-lg shadow p-8">
            <h2 className="text-3xl font-bold text-white mb-6">Report a Civic Issue</h2>
             <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-300">Issue Category *</label>
                    <select id="category" required value={category} onChange={e => setCategory(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-gray-700 border-gray-600 rounded-md shadow-sm text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
                        <option value="">Select a category</option>
                        <option value="pothole">Pothole</option>
                        <option value="garbage">Garbage Dump</option>
                        <option value="streetlight-outage">Streetlight Outage</option>
                        <option value="other">Other</option>
                    </select>
                </div>
                 <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-300">Description *</label>
                    <textarea id="description" rows="4" required value={description} onChange={e => setDescription(e.target.value)} placeholder="Provide a detailed description..." className="mt-1 block w-full px-3 py-2 bg-gray-700 border-gray-600 rounded-md shadow-sm text-white focus:outline-none focus:ring-indigo-500"></textarea>
                    <button type="button" onClick={handleEnhanceDescription} disabled={isEnhancing} className="mt-2 w-full text-sm text-indigo-400 hover:text-indigo-300 disabled:opacity-50 disabled:cursor-not-allowed">
                        {isEnhancing ? 'Enhancing...' : '✨ Enhance Description with AI'}
                    </button>
                </div>
                <div>
                    <label htmlFor="address" className="block text-sm font-medium text-gray-300">Address / Landmark *</label>
                    <input id="address" type="text" required value={address} onChange={e => setAddress(e.target.value)} placeholder="e.g., Near City Park" className="mt-1 block w-full px-3 py-2 bg-gray-700 border-gray-600 rounded-md shadow-sm text-white focus:outline-none focus:ring-indigo-500"/>
                </div>
                 <div className="flex justify-end pt-4">
                    <button type="submit" className="inline-flex justify-center items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700">
                        Submit Report
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ReportPage;

