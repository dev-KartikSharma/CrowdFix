import React from 'react';

// A simple modal component to display generated content
const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;

    const handleCopyToClipboard = () => {
        const content = document.getElementById('modal-content-text');
        if (content) {
            const textArea = document.createElement('textarea');
            textArea.value = content.innerText;
            document.body.appendChild(textArea);
            textArea.select();
            // Use execCommand for broader compatibility in sandboxed environments
            try {
                document.execCommand('copy');
                alert('Copied to clipboard!');
            } catch (err) {
                console.error('Failed to copy text: ', err);
                alert('Failed to copy text.');
            }
            document.body.removeChild(textArea);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-lg mx-4">
                <h3 className="text-xl font-bold text-white mb-4">{title}</h3>
                <div id="modal-content-text" className="text-gray-300 whitespace-pre-wrap bg-gray-900 p-4 rounded-md max-h-96 overflow-y-auto">{children}</div>
                <div className="mt-6 flex justify-end space-x-4">
                     <button onClick={handleCopyToClipboard} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">Copy to Clipboard</button>
                    <button onClick={onClose} className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500">Close</button>
                </div>
            </div>
        </div>
    );
};

export default Modal;
