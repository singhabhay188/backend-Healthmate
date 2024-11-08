const express = require('express');
const router = express.Router();
const prisma = require('../db');

const brands = require('../utils/brands');

//to get all brands
// api/brand/all
router.get('/all', async (req, res) => {
    try {
        res.status(200).json({
            success: true,
            count: brands.length,
            data: brands
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Server Error',
            message: error.message
        });
    }
});

//to get products with exact brand name
// api/brand/:brandName
router.get('/:brandName', async (req, res) => {
    const {brandName} = req.params;
    try {
        const products = await prisma.product.findMany({
            where: {
                brand: brandName
            }
        });
        res.status(200).json({success: true, data: products});
    } catch (error) {
        res.status(500).json({success: false, message: error.message});
    }
});

module.exports = router;
