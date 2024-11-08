const express = require('express');
const router = express.Router();

const categories = require('../utils/categories');

// @desc    Get all categories
// @route   GET /api/category
// @access  Public
router.get('/', async (req, res) => {
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

// @desc    Get single category by ID
// @route   GET /api/category/:id
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        const categories = require('../utils/categories');
        

        const category = categories.find(cat => cat.id === parseInt(id));

        if (!category) {
            return res.status(404).json({
                success: false,
                error: 'Category not found'
            });
        }

        res.status(200).json({
            success: true,
            data: category
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Server Error',
            message: error.message
        });
    }
});

module.exports = router;
