import express from "express";
import prisma from "../db.js";

const router = express.Router();

//to add products in bulk
// api/temp/addBulk
router.post('/addBulk', async (req, res) => {
    try {
        const { products } = req.body;

        if (!Array.isArray(products)) {
            return res.status(400).json({
                success: false,
                message: 'Request body must be an array of products'
            });
        }

        const createdProducts = await prisma.product.createMany({
            data: products.map(product => ({
                name: product.name,
                description: product.description,
                imageLink: product.imageLink,
                thumbnail: product.thumbnail,
                type: product.type,
                quantity: product.quantity,
                productType: product.productType,
                categories: product.categories,
                brand: product.brand,
                price: product.price,
                discountPer: product.discountPer
            }))
        });

        res.status(200).json({ success: true, message: 'Products created successfully', data: createdProducts });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

export default router;