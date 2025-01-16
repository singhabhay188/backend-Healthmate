import express from "express";
import prisma from "../db.js";
import authenticateToken from "../middleware/authenticateToken.js";

const router = express.Router();
import categories from "../utils/categories.js";

//to get all categories
// api/category/all
router.get('/all', authenticateToken, async (req, res) => {
    try {
        res.status(200).json({
            success: true,
            message: 'Categories fetched successfully',
            data: { count: categories.length, categories }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
});

//to get products of a particular category
// api/category/:categoryName
router.get('/:categoryName', authenticateToken, async (req, res) => {
    const { categoryName } = req.params;
    try {
        const products = await prisma.product.findMany({
            where: {
                categories: {
                    has: categoryName
                }
            }
        });
        res.status(200).json({ success: true, message: 'Products fetched successfully', data: products });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
});

export default router;
