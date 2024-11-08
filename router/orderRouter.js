const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authenticateToken');
const prisma = require('../db');

//to create new order
// api/order/new
router.post('/new',authenticateToken,async (req,res) => {
  try {
    const { products } = req.body; // array of product id and quantity ex: [{id:abc,quantity:3},{id:xyz,quantity:3}]
    const userId = req.user.id;

    // Fetch product details and calculate total price
    let totalPrice = 0;
    const orderItems = [];

    for (const item of products) {
      const product = await prisma.product.findUnique({
        where: { id: item.id }
      });
      
      if (!product) {
        return res.status(404).json({ error: `Product with id ${item.id} not found` });
      }

      // You'll need to add price field to your Product model and use it here
      totalPrice += product.price * item.quantity;
      
      orderItems.push({
        productId: item.id,
        quantity: item.quantity
      });
    }

    // Create order with items
    const order = await prisma.order.create({
      data: {
        userId: userId,
        totalPrice: totalPrice,
        status: 'pending',
        orderItems: {
          create: orderItems
        }
      },
      include: {
        orderItems: true
      }
    });

    res.status(201).json(order);
  } catch (error) {
    console.error('Order creation error:', error);
    res.status(500).json({ error: 'An error occurred while creating the order' });
  }
});

//to get all orders of a user
// api/order/all (maximum 5 orders)
router.get('/all',authenticateToken,async (req,res) => {
  const userId = req.user.id;
  const orders = await prisma.order.findMany({
    where: {userId: userId},
    take: 5,
    include: {
      orderItems: {
        include: {
          product: true
        }
      }
    }
  });
  res.status(200).json({success: true,data: orders});
});

module.exports = router;