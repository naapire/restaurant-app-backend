import express from "express";
import {
  deleteUser,
  getAllUsers,
  loginUser,
  signUp,
  updateUser,
  assignManager,
} from "../controllers/usercontroller.ts";
import { authMiddleware, isAdmin } from "../middleware/authmiddleware.ts";

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
 *         restaurantId:
 *           type: integer
 *           description: ID of the restaurant associated with the user
 *     SignUpRequest:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
 *       properties:
 *         name:
 *           type: string
 *           example: John Doe
 *         email:
 *           type: string
 *           example: johndoe@gmail.com
 *         password:
 *           type: string
 *           example: password123
 *         location:
 *           type: string
 *           example: Accra
 *         role:
 *           type: string
 *           example: manager
 *         restaurantId:
 *           type: integer
 *           example: 2
 *           description: Restaurant ID the user is associated with
 *     LoginRequest:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           example: johndoe@gmail.com
 *         password:
 *           type: string
 *           example: password123
 */

/**
 * @swagger
 * tags:
 *   - name: Users
 *     description: User management APIs
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
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 */
routes.post("/signup", signUp);

/**
 * @swagger
 * /login:
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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 */
routes.post("/login", loginUser);

/**
 * @swagger
 * /users/{id}:
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
 *               location:
 *                 type: string
 *               role:
 *                 type: string
 *               restaurantId:
 *                 type: integer
 *                 example: 3
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 */
routes.put("/users/:id", updateUser);

/**
 * @swagger
 * /users/{id}:
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
routes.delete("/users/:id", deleteUser);

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users
 *    security:
 *       - bearerAuth: []
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: List of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */
routes.get("/users",authMiddleware, isAdmin, getAllUsers);

/**
 * @swagger
 * /assign-manager:
 *   post:
 *     summary: Assign an existing user as a manager to a restaurant
 *     description: This endpoint allows a super admin to promote an existing user by email and link them to a specific restaurant.
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - restaurantId
 *             properties:
 *               email:
 *                 type: string
 *                 example: johndoe@gmail.com
 *               restaurantId:
 *                 type: integer
 *                 example: 3
 *     responses:
 *       200:
 *         description: User has been successfully assigned as manager
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User has been assigned as manager successfully.
 *       400:
 *         description: Missing or invalid parameters
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error while assigning manager
 */
routes.post("/assign-manager", assignManager);

export default routes;
