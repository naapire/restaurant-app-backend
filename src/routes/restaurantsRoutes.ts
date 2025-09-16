import express from "express";
import { createRestaurant, deleteRestaurant, getAllRestaurant, getRestaurantById, updateRestaurant } from "../controllers/restaurantcontrollers.ts";

const restaurantRoutes = express.Router();

/**
 * @swagger
 * components:
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
 // Restaurants
/**
 * @swagger
 * /createRestaurant:
 *   post:
 *     summary: Create a restaurant
 *     tags: [Restaurants]
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
 *       200:
 *         description: Restaurant created successfully
 */
restaurantRoutes.post("/createRestaurant", createRestaurant);

/**
 * @swagger
 * /restaurants:
 *   get:
 *     summary: Get all restaurants
 *     tags: [Restaurants]
 *     responses:
 *       200:
 *         description: List of restaurants
 */
restaurantRoutes.get("/restaurants", getAllRestaurant);

/**
 * @swagger
 * /restaurants/{id}:
 *   get:
 *     summary: Get a restaurant by id
 *     tags: [Restaurants]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Restaurant object
 */
restaurantRoutes.get("/restaurants/:id", getRestaurantById);

/**
 * @swagger
 * /restaurants/{id}:
 *   put:
 *     summary: Update a restaurant by id
 *     tags: [Restaurants]
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
 */
restaurantRoutes.put("/restaurants/:id", updateRestaurant);

/**
 * @swagger
 * /restaurants/{id}:
 *   delete:
 *     summary: Delete a restaurant by id
 *     tags: [Restaurants]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Restaurant deleted successfully
 */
restaurantRoutes.delete("/restaurants/:id", deleteRestaurant);
export default restaurantRoutes