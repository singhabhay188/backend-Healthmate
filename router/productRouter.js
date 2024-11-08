const express = require('express');
const router = express.Router();
const prisma = require('../db');

//to get all products
// api/product/all (maximum 10 products)
router.get('/all',async (req,res) => {
    const products = await prisma.product.findMany({
        take: 10
    });
    res.status(200).json({success: true,data: products});
});

//search products starting with
//needs minimum 3 characters
// api/product/search?query={name}
router.get('/search',async (req,res)=>{
    try{
        const {query} = req.query;
        if(!query || query.length < 3) return res.status(400).json({success: false,message: 'Query must be at least 3 characters long.'});
        const  products = await prisma.product.findMany({
            where: {
                name: {
                    startsWith: query,
                    mode: 'insensitive'
                }
            }
        })
        res.status(200).json({success: true,data: products});
    } catch (error) {
        res.status(500).json({success: false,message: error.message});
    }
});



module.exports = router;