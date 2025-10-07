import express from "express";
import {
  addToCart,
  getCart,
  updateCartItem,
  deleteCartItem,
} from "../controllers/cartcontroller.ts";
import { authMiddleware } from "../middleware/authmiddleware.ts";

const cartRoutes = express.Router();

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     CartItem:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         menu_item_id:
 *           type: integer
 *         quantity:
 *           type: integer
 *         price:
 *           type: number
 *           format: float
 *         status:
 *           type: string
 *           enum: [active, checked_out, abandoned]
 *         created_at:
 *           type: string
 *           format: date-time
 *         updated_at:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /cart:
 *   post:
 *     summary: Add an item to the cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - menu_item_id
 *               - quantity
 *               - price
 *             properties:
 *               menu_item_id:
 *                 type: integer
 *               quantity:
 *                 type: integer
 *               price:
 *                 type: number
 *                 format: float
 *     responses:
 *       201:
 *         description: Item added to cart successfully
 */
cartRoutes.post("/cart", authMiddleware, addToCart);

/**
 * @swagger
 * /cart:
 *   get:
 *     summary: Get all active cart items
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of active cart items
 */
cartRoutes.get("/cart", authMiddleware, getCart);

/**
 * @swagger
 * /cart/{id}:
 *   put:
 *     summary: Update a cart item (quantity or status)
 *     tags: [Cart]
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
 *               quantity:
 *                 type: integer
 *               status:
 *                 type: string
 *                 enum: [active, checked_out, abandoned]
 *     responses:
 *       200:
 *         description: Cart item updated successfully
 */
cartRoutes.put("/cart/:id", authMiddleware, updateCartItem);

/**
 * @swagger
 * /cart/{id}:
 *   delete:
 *     summary: Remove an item from the cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Cart item removed successfully
 */
cartRoutes.delete("/cart/:id", authMiddleware, deleteCartItem);

export default cartRoutes;
