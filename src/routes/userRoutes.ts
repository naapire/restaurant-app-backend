import express from "express";
import {  deleteUser, getAllUsers, loginUser, signUp, updateUser } from "../controllers/usercontroller.ts";
import { createRestaurant, deleteRestaurant, getAllRestaurant, getRestaurantById, updateRestaurant } from "../controllers/restaurantcontrollers.ts";


const routes = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *         email:
 *           type: string
 *         location:
 *           type: string
 *         role:
 *           type: string
 *     SignUpRequest:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
 *       properties:
 *         name:
 *           type: string
 *         email:
 *           type: string
 *         password:
 *           type: string
 *         location:
 *           type: string
 *         role:
 *           type: string
 *     LoginRequest:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *         password:
 *           type: string
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
 * /signup:
 *   post:
 *     summary: Register a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SignUpRequest'
 *     responses:
 *       200:
 *         description: User created successfully
 */
routes.post("/signup", signUp);

/**
 * @swagger
 * /logIn:
 *   post:
 *     summary: Login user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Login successful
 */
routes.post("/logIn", loginUser);

/**
 * @swagger
 * /{id}:
 *   put:
 *     summary: Update a user by id
 *     tags: [Users]
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
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: User updated successfully
 */
routes.put("/:id", updateUser);

/**
 * @swagger
 * /{id}:
 *   delete:
 *     summary: Delete a user by id
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: User deleted successfully
 */
routes.delete("/:id", deleteUser);

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: List of users
 */
routes.get("/users", getAllUsers);

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
routes.post("/createRestaurant", createRestaurant);

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
routes.get("/restaurants", getAllRestaurant);

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
routes.get("/restaurants/:id", getRestaurantById);

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
routes.put("/restaurants/:id", updateRestaurant);

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
routes.delete("/restaurants/:id", deleteRestaurant);

export default routes;