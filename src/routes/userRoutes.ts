import express from "express";
import {  deleteUser, getAllUsers, loginUser, signUp, updateUser } from "../controllers/usercontroller.ts";
import { createRestaurant, deleteRestaurant, getAllRestaurant, getRestaurantById, updateRestaurant } from "../controllers/restaurantcontrollers.ts";
import { createMenu, getMenus, getMenuById, updateMenu, deleteMenu } from "../controllers/menucontroller.ts";


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
 *     Menu:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *         promotionDetails:
 *           type: string
 *         is_available:
 *           type: boolean
 *         image_url:
 *           type: string
 *         restaurant_id:
 *           type: integer
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
/** 
* @swagger
 * /restaurants/{restaurantId}/menus:
 *   post:
 *     summary: Create a menu for a restaurant
 *     tags: [Menus]
 *     parameters:
 *       - in: path
 *         name: restaurantId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Menu'
 *     responses:
 *       201:
 *         description: Menu created successfully
 */
routes.post("/restaurants/:restaurantId/menus", createMenu);

/**
 * @swagger
 * /restaurants/{restaurantId}/menus:
 *   get:
 *     summary: Get all menus for a restaurant
 *     tags: [Menus]
 *     parameters:
 *       - in: path
 *         name: restaurantId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of menus
 */
routes.get("/restaurants/:restaurantId/menus", getMenus);

/**
 * @swagger
 * /restaurants/{restaurantId}/menus/{menuId}:
 *   get:
 *     summary: Get a menu by ID for a restaurant
 *     tags: [Menus]
 *     parameters:
 *       - in: path
 *         name: restaurantId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: menuId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Menu object
 */
routes.get("/restaurants/:restaurantId/menus/:menuId", getMenuById);

/**
 * @swagger
 * /restaurants/{restaurantId}/menus/{menuId}:
 *   put:
 *     summary: Update a menu by ID for a restaurant
 *     tags: [Menus]
 *     parameters:
 *       - in: path
 *         name: restaurantId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: menuId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Menu'
 *     responses:
 *       200:
 *         description: Menu updated successfully
 */
routes.put("/restaurants/:restaurantId/menus/:menuId", updateMenu);

/**
 * @swagger
 * /restaurants/{restaurantId}/menus/{menuId}:
 *   delete:
 *     summary: Delete a menu by ID for a restaurant
 *     tags: [Menus]
 *     parameters:
 *       - in: path
 *         name: restaurantId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: menuId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Menu deleted successfully
 */
routes.delete("/restaurants/:restaurantId/menus/:menuId", deleteMenu);

export default routes;