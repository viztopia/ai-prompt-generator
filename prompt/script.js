// Your Google API key
const GOOGLE_API_KEY = 'your-key';

async function generatePrompt(formulaPrompt, wrapperPrompt, numPrompts = 1) {
    try {
        const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=' + GOOGLE_API_KEY, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: `You are a creative prompt engineer. Using this formula as a base:
                        ${formulaPrompt}
                        
                        ${wrapperPrompt}
                        
                        ${numPrompts === 1 ? 
                            'Provide just the completed prompt with no additional text or explanations.' : 
                            `Generate ${numPrompts} unique and creative prompts. Provide just the completed prompts with no additional text and no bulletin number, one per line.`}`
                    }]
                }]
            })
        });

        const data = await response.json();
        return data.candidates[0].content.parts[0].text.trim();
    } catch (error) {
        console.error('Error:', error);
        return 'Error generating prompt. Please check your API key and try again.';
    }
}

async function generateSinglePrompt() {
    const formulaPrompt = document.getElementById('singleFormulaPrompt').value;
    const wrapperPrompt = document.getElementById('singleWrapperPrompt').value;
    const outputElement = document.getElementById('singleOutput').querySelector('pre');
    
    outputElement.textContent = 'Generating...';
    const result = await generatePrompt(formulaPrompt, wrapperPrompt);
    outputElement.textContent = result;
}

async function generateMultiplePrompts() {
    const formulaPrompt = document.getElementById('multipleFormulaPrompt').value;
    const wrapperPrompt = document.getElementById('multipleWrapperPrompt').value;
    const numPrompts = parseInt(document.getElementById('numPrompts').value);
    const outputElement = document.getElementById('multipleOutput').querySelector('pre');
    
    outputElement.textContent = 'Generating...';
    const result = await generatePrompt(formulaPrompt, wrapperPrompt, numPrompts);
    outputElement.textContent = result;
}