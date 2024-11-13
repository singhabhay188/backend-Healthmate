const express = require('express');
const router = express.Router();
const prisma = require('../db');

//to get all products
// api/product/all (maximum 15 products)
router.get('/all',async (req,res) => {
    try{
        let {order,type} = req.body;
        //order -> asc | desc
        //type ->  name | price

        if(!order || !type){
            const products = await prisma.product.findMany({
                take: 15
            });
            return res.status(200).json({success: true,data: products});
        }
            const products = await prisma.product.findMany({
                take: 15,
                orderBy:{
                    type:order
                }
            });
            res.status(200).json({success: true,data: products});
        
    }
    catch(e){
        res.status(500).json({success: false,message: e.message});
    }

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

//to get product by id
// api/prodcut/:id
router.get('/:id',async (req,res)=>{
    const {id} = req.params;
    const product = await prisma.product.findUnique({where: {id}});
    res.status(200).json({success: true,data: product});
});


module.exports = router;