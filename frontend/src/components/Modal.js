import React, { useState } from 'react';

const Modal = ({ title, content, onClose }) => {
    const [copyButtonText, setCopyButtonText] = useState('Copy Text');

    const handleCopyToClipboard = () => {
        // Use a more robust method for clipboard access that works in most environments
        const textArea = document.createElement('textarea');
        textArea.value = content;
        document.body.appendChild(textArea);
        textArea.select();
        try {
            document.execCommand('copy');
            setCopyButtonText('Copied!');
            setTimeout(() => setCopyButtonText('Copy Text'), 2000); // Reset after 2 seconds
        } catch (err) {
            console.error('Failed to copy text: ', err);
            setCopyButtonText('Failed to Copy');
             setTimeout(() => setCopyButtonText('Copy Text'), 2000);
        }
        document.body.removeChild(textArea);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] flex flex-col">
                <div className="flex justify-between items-center p-4 border-b border-gray-700">
                    <h3 className="text-xl font-bold text-white">{title}</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl leading-none">&times;</button>
                </div>
                <div className="p-6 overflow-y-auto">
                    <p className="text-gray-300 whitespace-pre-wrap">{content}</p>
                </div>
                <div className="flex justify-end p-4 border-t border-gray-700">
                     <button 
                        onClick={handleCopyToClipboard}
                        className="px-4 py-2 mr-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors duration-200"
                    >
                        {copyButtonText}
                    </button>
                    <button onClick={onClose} className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-500">
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Modal;

