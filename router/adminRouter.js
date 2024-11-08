const express = require('express');
const router = express.Router();
const prisma = require('../db');

//to add new product
// api/admin/new
router.post('/new', async (req, res) => {
    try {
        let {name, description, imageLink, type, quantity, productType, categories, brand} = req.body;
        
        // Ensure imageLink and categories are arrays
        if (!Array.isArray(imageLink) || !Array.isArray(categories)) {
            return res.status(400).json({
                success: false,
                message: 'imageLink and categories must be arrays'
            });
        }

        const product = await prisma.product.create({
            data: {
                name,
                description,
                imageLink,
                type,
                quantity,
                productType,
                categories,
                brand
            }
        });
        
        res.status(200).json({success: true, data: product});
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

//to get all orders
// api/admin/orders (maximum 10 orders)
router.get('/orders', async (req, res) => {
    try {
        const orders = await prisma.order.findMany({
            take: 10
        });
        res.status(200).json({success: true, data: orders});
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

//to get all pending orders
// api/admin/pendingOrders (maximum 10 orders)
router.get('/pendingOrders', async (req, res) => {
    try {
        const orders = await prisma.order.findMany({
            where: {status: 'pending'}
        });
        res.status(200).json({success: true, data: orders});
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

//get order details
// api/admin/order/:id
router.get('/order/:id', async (req, res) => {
    try {
        const {id} = req.params;
        const order = await prisma.order.findUnique({
            where: {id: id},
            include: {
                orderItems: {
                    include: {
                        product: true
                    }
                }
            }
        });
        res.status(200).json({success: true, data: order});
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

//to update order status
// api/admin/order/:id
router.post('/order/:id', async (req, res) => {
    try {
        const {id} = req.params;
        const {status} = req.body;

        const order = await prisma.order.update({
            where: {id: id},
            data: {status: status}
        });
        res.status(200).json({success: true, data: order});
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

module.exports = router;

