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

async function generateImage() {
    const promptElement = document.getElementById('singleOutput').querySelector('pre');
    const prompt = promptElement.textContent;
    
    if (!prompt || prompt === 'Generating...' || prompt.includes('Error')) {
        alert('Please generate a valid prompt first');
        return;
    }

    const loadingIndicator = document.getElementById('loadingIndicator');
    const generatedImage = document.getElementById('generatedImage');
    
    loadingIndicator.style.display = 'block';
    generatedImage.style.display = 'none';

    try {
        const response = await fetch('http://127.0.0.1:7860/sdapi/v1/txt2img', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                prompt: prompt,
                steps: 20,
                width: 512,
                height: 512,
                cfg_scale: 7,
                sampler_name: "Euler a"
            })
        });

        const data = await response.json();
        
        if (data.images && data.images[0]) {
            generatedImage.src = `data:image/png;base64,${data.images[0]}`;
            generatedImage.style.display = 'block';
        } else {
            throw new Error('No image data received');
        }
    } catch (error) {
        console.error('Error generating image:', error);
        alert('Error generating image. Please check if Stable Diffusion API is running.');
    } finally {
        loadingIndicator.style.display = 'none';
    }
}

// Add event listeners when the document is loaded
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('generateImageBtn').addEventListener('click', generateImage);
});