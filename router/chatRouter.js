const express = require('express');
const router = express.Router();

//to chat with the bot
// api/chat/reply
router.get('/reply', async (req, res) => {
    const {message} = req.body;

    if(!message) {
        return res.status(400).json({success: false, message: 'Message is required'});
    }

    res.status(200).json({success: true, reply: 'Hi I am chatbot from HealthMate. I can help you tell me your symptoms.'});
});

module.exports = router;
