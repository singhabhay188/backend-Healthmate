import express from "express";
import prisma from "../db.js";

const router = express.Router();

//check admin
// api/admin/login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (email == 'admin@gmail.com' && password == "Admin@123") {
            return res.status(200).json({ success: true, message: "Admin logged in successfully" });
        }
        res.status(400).json({ success: false, message: "Admin login failed" });
    } catch (e) {
        res.status(500).json({
            success: false,
            message: e.message
        });
    }
});

//to add new product
// api/admin/new
router.post('/new', async (req, res) => {
    try {
        let { name, description, imageLink, thumbnail, type, quantity, productType, categories, brand, price, discountPer } = req.body;

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
                brand,
                price,
                discountPer
            }
        });

        res.status(200).json({ success: true, message: 'Product created successfully', data: product });
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
            include: {
                items: true
            },
            take: 10
        });
        res.status(200).json({ success: true, message: 'Orders fetched successfully', data: orders });
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
            where: { status: 'PENDING' },
            take: 10
        });
        res.status(200).json({ success: true, message: 'Pending orders fetched successfully', data: orders });
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
        const { id } = req.params;
        const order = await prisma.order.findUnique({
            where: { id: id },
            include: {
                items: {
                    include: {
                        product: true
                    }
                }
            }
        });
        res.status(200).json({ success: true, message: 'Order details fetched successfully', data: order });
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
        const { id } = req.params;
        const { status } = req.body;

        const order = await prisma.order.update({
            where: { id: id },
            data: { status: status }
        });
        res.status(200).json({ success: true, message: 'Order status updated successfully', data: order });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

export default router;

