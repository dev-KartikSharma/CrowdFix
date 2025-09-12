// --- Configuration ---
const apiKey = "AIzaSyDXdononVwMTDPS6HHGNuktLhg7kfE76YU";
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

/**
 * A reusable function to call the Gemini API.
 * @param {string} prompt The prompt to send to the AI.
 * @returns {Promise<string>} The AI-generated text.
 */
export async function callGeminiApi(prompt) {
    const payload = {
        contents: [{ parts: [{ text: prompt }] }],
    };

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        return result.candidates?.[0]?.content?.parts?.[0]?.text.trim() || "AI could not generate a response.";
    } catch (error) {
        console.error("Gemini API call failed:", error);
        return "Error: Unable to process the request with AI.";
    }
}

