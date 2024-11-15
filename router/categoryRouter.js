const express = require('express');
const router = express.Router();
const prisma = require('../db');

const categories = require('../utils/categories');

//to get all categories
// api/category/all
router.get('/all', async (req, res) => {
    try {
        res.status(200).json({
            success: true,
            count: categories.length,
            data: categories
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Server Error',
            message: error.message
        });
    }
});

//to get products of a particular category
// api/category/:categoryName
router.get('/:categoryName', async (req, res) => {
    const {categoryName} = req.params;
    try {
        const products = await prisma.product.findMany({
            where: {
                categories: {
                    has: categoryName
                }
            }
        });
        res.status(200).json({success: true, data: products});
    } catch (error) {
        res.status(500).json({success: false, message: error.message});
    }
});

module.exports = router;
