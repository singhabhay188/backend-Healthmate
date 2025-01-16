import express from "express";
import { z } from "zod";
import prisma from "../db.js";
import authenticateToken from "../middleware/authenticateToken.js";

const router = express.Router();

const signupSchema = z.object({
    name: z.string().min(3, 'Name must be at least 3 characters long'),
    email: z.string().email().optional(),
    phone: z.string().length(10, 'Phone no must be 10 characters long')
});

const loginSchema = z.object({
    phone: z.string().length(10, 'Phone no must be 10 characters long')
});

const verifyOtpSchema = z.object({
    phone: z.string().length(10, 'Phone no must be 10 characters long'),
    otp: z.string().length(4, 'OTP must be 4 characters long')
});

// Create a new user
// api/user/signup
router.post('/signup', async (req, res) => {
    const result = signupSchema.safeParse(req.body);
    if (!result.success) {
        return res.status(400).json({ success: false, message: 'Invalid Input. Need 10 digit phone && minimum 3 char name && optional email' });
    }
    const { name, email = null, phone } = result.data;

    try {
        //ensure phone is unique
        let existingUser = await prisma.user.findFirst({
            where:{
                phone: phone
            }
        });

        if(existingUser) return res.status(400).json({ success: false, message: 'Phone no already exist.' });

        const user = await prisma.user.create({
            data: { name, email, phone }
        });
        res.status(201).json({ success: true, message: 'User created successfully', data: { token: user.id } });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

//login with phone 
//user will be asked for otp
// api/user/login
router.post('/login',async (req,res) => {
    const result = loginSchema.safeParse(req.body);
    if (!result.success) {
        return res.status(400).json({ success: false, message: 'Invalid Input. Need 10 digit phone' });
    }
    const { phone } = result.data;

    try {
        let existingUser = await prisma.user.findFirst({
            where:{
                phone: phone
            }
        });

        if(!existingUser) return res.status(400).json({ success: false, message: 'User not found.' });
           // reality mei otp send krna padega
        res.status(200).json({ success: true, message: 'OTP sent to phone' });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

//default otp rawat is 1234
// api/user/verifyOtp
router.post('/verifyOtp',async (req,res) => {
    const result = verifyOtpSchema.safeParse(req.body);
    if (!result.success) {
        return res.status(400).json({ success: false, message: 'Invalid Input. Need 10 digit phone && 4 digit otp' });
    }
    const { phone, otp } = result.data;

    if(otp !== '1234'){
        return res.status(400).json({ success: false, message: 'Invalid OTP.' });
    }

    try {
        let existingUser = await prisma.user.findFirst({
            where:{
                phone: phone
            }
        });

        if(!existingUser) return res.status(400).json({ success: false, message: 'User not found.' });

        res.status(200).json({ success: true, message: 'OTP verified', data: { token: existingUser.id } });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

//to verify if user is logged in
// api/user/verifyLoggedIn
router.get('/verifyLoggedIn',authenticateToken,async (req,res) => {
    res.status(200).json({ success: true, message: 'User is logged in' });
});

export default router;