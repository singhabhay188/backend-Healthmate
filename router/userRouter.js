const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authenticateToken');
const prisma = require('../db');

// Create a new user
//here email is optional
// api/user/signup
router.post('/signup', async (req, res) => {
    const { name, email=null, phone } = req.body;

    try {
        if (!name || !phone) {
            return res.status(400).json({ error: 'Name and phone are required' });
        }

        //ensure phone is unique
        let existingUser = await prisma.user.findFirst({
            where:{
                phone: phone
            }
        });

        if(existingUser) return res.status(400).json({error: 'Phone no already exist.'});

        const user = await prisma.user.create({
            data: { name, email, phone }
        });
        res.status(201).json({success: true,token: user.id});
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

//login with phone 
//user will be asked for otp
// api/user/login
router.post('/login',async (req,res) => {
    const {phone} = req.body;

    try {
        let existingUser = await prisma.user.findFirst({
            where:{
                phone: phone
            }
        });

        if(!existingUser) return res.status(400).json({error: 'User not found.'});

        res.status(200).json({message: 'OTP sent to phone.'});
    } catch (error) {
        res.status(400).json({error: error.message});
    }
});

//default otp rawat is 1234
// api/user/verifyOtp
router.post('/verifyOtp',async (req,res) => {
    const {phone,otp} = req.body;

    if(!phone || !otp) return res.status(400).json({error: 'Phone and OTP are required.'});

    if(otp !== '1234'){
        return res.status(400).json({error: 'Invalid OTP.'});
    }


    try {
        let existingUser = await prisma.user.findFirst({
            where:{
                phone: phone
            }
        });

        console.log(existingUser);

        if(!existingUser) return res.status(400).json({error: 'User not found.'});

        res.status(200).json({success: true,token: existingUser.id});
    } catch (error) {
        res.status(400).json({error: error.message});
    }
});

//to verify if user is logged in
// api/user/verifyLoggedIn
router.get('/verifyLoggedIn',authenticateToken,async (req,res) => {
    res.status(200).json({success: true});
});

module.exports = router;