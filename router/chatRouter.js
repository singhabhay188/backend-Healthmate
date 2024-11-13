const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");

//to chat with the bot
// api/chat/reply
router.post('/reply', async (req, res) => {
    const {message} = req.body;

    if(!message) {
        return res.status(400).json({success: false, message: 'Message is required'});
    }

    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const updatedMessage = `i am building a chat bot for my health website here user will ask a question and you have to answer this if user question is related to health answer it by recommending things that he can change in daily routing or some general suggestions else simply refuse the query by saying i am built for answering health related questions user question is "${message}"`

    const result = await model.generateContent(updatedMessage);

    res.status(200).json({success: true, reply: result.response.text()});
});

module.exports = router;
