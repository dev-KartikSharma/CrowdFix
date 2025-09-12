// --- Gemini API Call Function ---
// A reusable function to call the Gemini API with error handling and exponential backoff.
export const callGeminiApi = async (prompt, retries = 3, delay = 1000) => {
    // Read the API key from the .env file.
    // Make sure you have a .env file in your root folder with:
    // REACT_APP_GEMINI_API_KEY="your-key-here"
    const apiKey = "AIzaSyDXdononVwMTDPS6HHGNuktLhg7kfE76YU"; 
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

    const payload = {
        contents: [{ parts: [{ text: prompt }] }],
    };

    for (let i = 0; i < retries; i++) {
        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            const text = result.candidates?.[0]?.content?.parts?.[0]?.text;

            if (text) {
                return text;
            } else {
                throw new Error("No content received from API.");
            }
        } catch (error) {
            console.error(`API call attempt ${i + 1} failed:`, error);
            if (i === retries - 1) {
                // Last retry failed
                return "Error: Could not get a response from the AI. Please try again.";
            }
            // Wait before the next retry
            await new Promise(res => setTimeout(res, delay * Math.pow(2, i)));
        }
    }
};

