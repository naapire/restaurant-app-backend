import express from "express";
import {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  assignRider,
} from "../controllers/ordercontroller.ts";
import { authMiddleware, isAdmin } from "../middleware/authmiddleware.ts";

const orderRoutes = express.Router();

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     Order:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         user_id:
 *           type: integer
 *         rider_id:
 *           type: integer
 *         order_status:
 *           type: string
 *           enum: [pending, confirmed, preparing, on_the_way, delivered, cancelled]
 *         total:
 *           type: number
 *           format: float
 *         created_at:
 *           type: string
 *           format: date-time
 *         updated_at:
 *           type: string
 *           format: date-time
 *         items:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/CartItem'
 */

/**
 * @swagger
 * /orders:
 *   post:
 *     summary: Checkout cart and create a new order
 *     description: |
 *       Takes all active cart items for the logged-in user,
 *       creates an Order record, then clears the cart.
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       "201":
 *         description: Order created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 */
orderRoutes.post("/orders", authMiddleware,  createOrder);

/**
 * @swagger
 * /orders:
 *   get:
 *     summary: Get orders for the logged-in user
 *     description: |
 *       - Customers: only see their own orders.
 *       - Riders: see assigned orders.
 *       - Admin: see all orders.
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       "200":
 *         description: List of orders
 */
orderRoutes.get("/orders", authMiddleware, isAdmin, getOrders);

/**
 * @swagger
 * /orders/{id}:
 *   get:
 *     summary: Get order details by ID
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       "200":
 *         description: Order details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 */
orderRoutes.get("/orders/:id", authMiddleware,isAdmin, getOrderById);

/**
 * @swagger
 * /orders/{id}/status:
 *   put:
 *     summary: Update an order's status
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               order_status:
 *                 type: string
 *                 enum: [pending, confirmed, preparing, on_the_way, delivered, cancelled]
 *     responses:
 *       "200":
 *         description: Order status updated
 */
orderRoutes.put("/orders/:id/status", authMiddleware, updateOrderStatus);

/**
 * @swagger
 * /orders/{id}/assign:
 *   put:
 *     summary: Assign a rider to an order (Admin only)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - rider_id
 *             properties:
 *               rider_id:
 *                 type: integer
 *     responses:
 *       "200":
 *         description: Rider assigned successfully
 */
orderRoutes.put("/orders/:id/assign", authMiddleware, isAdmin, assignRider);

export default orderRoutes;
