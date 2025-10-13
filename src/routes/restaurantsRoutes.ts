import express from "express";
import multer from "multer";

import {
  createRestaurant,
  deleteRestaurant,
  getAllRestaurant,
  getRestaurantById,
  updateRestaurant,
} from "../controllers/restaurantcontrollers.ts";

const restaurantRoutes = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     Restaurant:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         restaurant_name:
 *           type: string
 *         address:
 *           type: string
 *         location:
 *           type: string
 */

/**
 * @swagger
 * tags:
 *   - name: Restaurants
 *     description: Restaurant management (Admin only)
 */

/**
 * @swagger
 * /restaurants:
 *   post:
 *     summary: Create a restaurant (Admin only)
 *     tags: [Restaurants]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - restaurant_name
 *               - address
 *               - location
 *             properties:
 *               restaurant_name:
 *                 type: string
 *               address:
 *                 type: string
 *               location:
 *                 type: string
 *     responses:
 *       201:
 *         description: Restaurant created successfully
 *       401:
 *         description: Unauthorized - Missing or invalid token
 *       403:
 *         description: Forbidden - Admins only
 */
restaurantRoutes.post("/restaurants", upload.single("image"), createRestaurant);

/**
 * @swagger
 * /restaurants:
 *   get:
 *     summary: Get all restaurants (Admin only)
 *     tags: [Restaurants]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of restaurants
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Restaurant'
 *       401:
 *         description: Unauthorized - Missing or invalid token
 *       403:
 *         description: Forbidden - Admins only
 */
restaurantRoutes.get("/restaurants", getAllRestaurant);

/**
 * @swagger
 * /restaurants/{id}:
 *   get:
 *     summary: Get a restaurant by id (Admin only)
 *     tags: [Restaurants]
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
 *         description: Restaurant object
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
restaurantRoutes.get("/restaurants/:id", getRestaurantById);

/**
 * @swagger
 * /restaurants/{id}:
 *   put:
 *     summary: Update a restaurant by id (Admin only)
 *     tags: [Restaurants]
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
 *               restaurant_name:
 *                 type: string
 *               address:
 *                 type: string
 *               location:
 *                 type: string
 *     responses:
 *       200:
 *         description: Restaurant updated successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
restaurantRoutes.put("/restaurants/:id", upload.single("image"), updateRestaurant);

/**
 * @swagger
 * /restaurants/{id}:
 *   delete:
 *     summary: Delete a restaurant by id (Admin only)
 *     tags: [Restaurants]
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
 *         description: Restaurant deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
restaurantRoutes.delete("/restaurants/:id", deleteRestaurant);

export default restaurantRoutes;
