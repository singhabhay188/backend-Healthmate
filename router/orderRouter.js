import { z } from "zod";
import express from "express";
import prisma from "../db.js";
import authenticateToken from "../middleware/authenticateToken.js";

const router = express.Router();

const createOrderSchema = z.array(
  z.object({
    id: z.string(),
    quantity: z.preprocess((val) => Number(val), z.number())
  })
);

//to create new order
// api/order/new
router.post('/new', authenticateToken, async (req, res) => {
  try {
    const { products } = req.body;

    const result = createOrderSchema.safeParse(products);

    if (!result.success) {
      return res.status(400).json({ success: false, message: 'Invalid inputs are passed', error: result.error.errors });
    }

    const userId = req.user.id;

    // Fetch product details and calculate total price
    let totalPrice = 0;
    const orderItems = [];

    for (const item of products) {
      const product = await prisma.product.findUnique({
        where: { id: item.id }
      });

      if (!product) {
        return res.status(404).json({ success: false, message: `Product with id ${item.id} not found` });
      }

      // You'll need to add price field to your Product model and use it here
      totalPrice += product.price * item.quantity;

      orderItems.push({
        productId: item.id,
        quantity: Number(item.quantity)
      });
    }

    // Create order with items
    const order = await prisma.order.create({
      data: {
        userId: userId,
        total: totalPrice,
        status: 'PENDING',
        items: {
          create: orderItems
        }
      },
      include: {
        items: true
      }
    });

    res.status(201).json({ success: true, message: 'Order created successfully', data: order });
  } catch (error) {
    console.error('Order creation error:', error);
    res.status(500).json({ success: false, message: 'An error occurred while creating the order' });
  }
});

//to get all orders of a user
// api/order/all (maximum 5 orders)
router.get('/all', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const orders = await prisma.order.findMany({
      where: { userId: userId },
      take: 5,
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    });
    res.status(200).json({ success: true, message: 'Orders fetched successfully', data: orders });
  } catch (error) {
    console.error('Order fetching error:', error);
    res.status(500).json({ success: false, message: 'An error occurred while fetching the orders' });
  }
});

export default router;