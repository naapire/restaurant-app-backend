import express from "express";
import { deleteUser, getAllUsers, loginUser, signUp, updateUser } from "../controllers/usercontroller.ts";

const userRoutes = express.Router();

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
 */

/**
 * @swagger
 * /signup:
 *   post:
 *     summary: Register a new user
 *     tags: [Users]
 */
userRoutes.post("/signup", signUp);

/**
 * @swagger
 * /logIn:
 *   post:
 *     summary: Login user
 *     tags: [Users]
 */
userRoutes.post("/logIn", loginUser);

/**
 * @swagger
 * /{id}:
 *   put:
 *     summary: Update a user by id
 *     tags: [Users]
 */
userRoutes.put("/:id", updateUser);

/**
 * @swagger
 * /{id}:
 *   delete:
 *     summary: Delete a user by id
 *     tags: [Users]
 */
userRoutes.delete("/:id", deleteUser);

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 */
userRoutes.get("/users", getAllUsers);

export default userRoutes;
