import { z } from "zod";
import express from "express";
import prisma from "../db.js";
import authenticateToken from "../middleware/authenticateToken.js";

const router = express.Router();

const getProductSchema = z.object({
    order: z.enum(['asc', 'desc']).optional(),
    type: z.enum(['name', 'price']).optional()
});

//to get all products
// api/product/all (maximum 15 products)
router.get('/all',authenticateToken, async (req,res) => {
    try{
        let {order,type} = req.body;

        const result = getProductSchema.safeParse({order,type});
        if(!result.success){
            throw new Error('Invalid inputs are passed');
        }

        //order -> asc | desc
        //type ->  name | price

        if(!order || !type){
            const products = await prisma.product.findMany({
                take: 15
            });
            return res.status(200).json({success: true, message: '', data: products});
        }
            const products = await prisma.product.findMany({
                take: 15,
                orderBy:{
                    type: order
                }
            });
            res.status(200).json({success: true,message: '', data: products});
        
    }
    catch(e){
        res.status(500).json({success: false,message: e.message});
    }

});

//search products starting with
//needs minimum 3 characters
// api/product/search?query={name}
router.get('/search',authenticateToken, async (req,res)=>{
    try{
        const {query} = req.query;
        if(!query || query.length < 3) return res.status(400).json({success: false,message: 'Query must be at least 3 characters long.'});
        const  products = await prisma.product.findMany({
            where: {
                name: {
                    contains: query,
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
router.get('/:id',authenticateToken, async (req,res)=>{
    const {id} = req.params;
    const product = await prisma.product.findUnique({where: {id}});
    res.status(200).json({success: true,data: product});
});

export default router;