const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

/**
 * Hàm dịch dữ liệu gấu từ tiếng Nhật sang Anh và Việt
 * @param {string} name - Tên tiếng Nhật
 * @param {string} description - Mô tả tiếng Nhật
 */
const translateBearData = async (name, description) => {
    try {
        const prompt = `
            You are a professional translator. 
            Input (Japanese): 
            - Name: ${name}
            - Description: ${description}

            Task: Translate them into English and Vietnamese.
            Output: Return ONLY a JSON object with this structure (no markdown):
            {
              "name_en": "...",
              "description_en": "...",
              "name_vi": "...",
              "description_vi": "..."
            }
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Clean markdown 
        const cleanText = text.replace(/```json|```/g, '').trim();

        return JSON.parse(cleanText);
    } catch (error) {
        console.error("Translation Error:", error);
        return null; // Trả về null để xử lý sau
    }
};

const translateBatch = async (bears) => {
    try {
        
        const inputData = bears.map(b => ({
            fid: b.fid, // Giữ ID để map ngược lại
            ja_name: b.name,
            ja_desc: b.description
        }));

        const prompt = `
        You are a translator. Translate the following JSON array of bear data from Japanese to English and Vietnamese.
        
        Rules:
        1. Keep the "fid" exactly as is.
        2. Translate "ja_name" to "name_en" and "name_vi".
        3. Translate "ja_desc" to "description_en" and "description_vi".
        4. Return ONLY a valid JSON Array. No markdown formatting.

        Input JSON:
        ${JSON.stringify(inputData)}
    `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        const cleanText = text.replace(/```json|```/g, '').trim();
        return JSON.parse(cleanText);
    } catch (error) {
        console.error("Batch Translation Error:", error);
        return null;
    }
};

module.exports = { translateBearData, translateBatch };