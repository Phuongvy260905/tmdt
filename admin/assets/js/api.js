const apiKey = import.meta.env.VITE_API_KEY;

// Model text ổn định (free tier tốt)
const GEMINI_TEXT_MODEL = "gemini-2.5-flash";

// Model image gen native (miễn phí trong quota Gemini API)
const GEMINI_IMAGE_MODEL = "gemini-2.5-flash"; // Hoặc "gemini-2.5-flash-preview-image" nếu preview khả dụng

async function fetchWithRetry(url, options, retries = 3) {
    for (let i = 0; i < retries; i++) {
        try {
            const response = await fetch(url, options);
            if (!response.ok) {
                const err = await response.json().catch(() => ({}));
                throw new Error(`HTTP ${response.status}: ${err.error?.message || 'Unknown error'}`);
            }
            return await response.json();
        } catch (err) {
            console.warn(`Retry ${i+1}/${retries}:`, err.message);
            if (i === retries - 1) throw err;
            await new Promise(r => setTimeout(r, 1000 * Math.pow(2, i)));
        }
    }
}

async function callGemini(prompt, system = "", useSearch = false) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_TEXT_MODEL}:generateContent?key=${apiKey}`;

    const payload = {
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        systemInstruction: { 
            parts: [{ text: system || "Bạn là chuyên gia phân tích kinh doanh công nghệ hàng đầu tại Việt Nam, có 15 năm kinh nghiệm." }] 
        },
        generationConfig: {
            temperature: 0.65,
            topP: 0.95,
            topK: 40,
            maxOutputTokens: 4096,
            responseMimeType: "text/plain"
        }
    };

    if (useSearch) payload.tools = [{ googleSearchRetrieval: {} }];

    try {
        const data = await fetchWithRetry(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        return data.candidates?.[0]?.content?.parts?.[0]?.text 
               || "AI không trả về nội dung.";
    } catch (err) {
        return `Lỗi Gemini: ${err.message}`;
    }
}

// Hàm tạo ảnh bằng Gemini native (miễn phí quota)
async function generateImage(prompt) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_IMAGE_MODEL}:generateContent?key=${apiKey}`;

    const payload = {
        contents: [{
            role: "user",
            parts: [{ text: prompt }]
        }],
        generationConfig: {
            responseModalities: ["IMAGE"],
            temperature: 0.7,
            maxOutputTokens: 4096
        },
        safetySettings: [{
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_NONE"
        }]
    };

    try {
        const data = await fetchWithRetry(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const imagePart = data.candidates?.[0]?.content?.parts?.find(p => p.inlineData);
        if (!imagePart || !imagePart.inlineData?.data) {
            throw new Error("Không nhận được dữ liệu ảnh từ Gemini");
        }

        return imagePart.inlineData.data; // base64 string
    } catch (err) {
        throw new Error(`Lỗi tạo ảnh: ${err.message}`);
    }
}