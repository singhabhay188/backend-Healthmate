import express from "express";
import prisma from "../db.js";
import authenticateToken from "../middleware/authenticateToken.js";

const router = express.Router();
import brands from "../utils/brands.js";

//to get all brands
// api/brand/all
router.get('/all', authenticateToken, async (req, res) => {
    try {
        res.status(200).json({
            success: true,
            message: 'Brands fetched successfully',
            data: { count: brands.length, brands }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

//to get products with exact brand name
// api/brand/:brandName
router.get('/:brandName', authenticateToken, async (req, res) => {
    const { brandName } = req.params;
    if (!brandName) {
        return res.status(400).json({ success: false, message: 'Brand name is required' });
    }

    try {
        const products = await prisma.product.findMany({
            where: {
                brand: brandName
            }
        });
        res.status(200).json({ success: true, message: 'Products fetched successfully', data: products });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

export default router;