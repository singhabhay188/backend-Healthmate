import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";

const router = express.Router();

//to chat with the bot
// api/chat/reply
router.post('/reply', async (req, res) => {
    let key = process.env.GOOGLE_API_KEY;
    if (!key) {
        return res.status(500).json({ success: false, message: 'Google API key is not provided' });
    }
    const { message } = req.body;
    if (!message) {
        return res.status(400).json({ success: false, message: 'Message is required' });
    }
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const updatedMessage = `i am building a chat bot for my health website here user will ask a question and you have to answer this if user question is related to health answer it by recommending things that he can change in daily routing or some general suggestions else simply refuse the query by saying i am built for answering health related questions user question is "${message}"`;

    try {
        const result = await model.generateContent(updatedMessage);
        res.status(200).json({ success: true, message: 'Reply generated successfully', data: { reply: result.response.text() } });
    } catch (error) {
        res.status(500).json({ success: false, message: 'An error occurred while generating the reply', error: error.message });
    }
});

export default router;