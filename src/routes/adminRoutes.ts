import express from "express";
import { getAdminStats } from "../controllers/admincontroller.ts";
import { getAllPermissions } from "../controllers/admincontroller.ts";
import { authMiddleware, isAdmin } from "../middleware/authmiddleware.ts";

const adminRoutes = express.Router();

/**
 * @swagger
 * /admin/stats:
 *   get:
 *     summary: Get overall platform statistics
 *     description: Allows an admin to view the total number of users, restaurants, and orders in the system.
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Statistics retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalUsers:
 *                   type: integer
 *                   example: 150
 *                 totalRestaurants:
 *                   type: integer
 *                   example: 25
 *                 totalOrders:
 *                   type: integer
 *                   example: 320
 *       401:
 *         description: Unauthorized. Missing or invalid token.
 *       403:
 *         description: Forbidden. Only admins can access this route.
 *       500:
 *         description: Server error.
 */
adminRoutes.get("/admin/stats",   getAdminStats);

/**
 * @swagger
 * /permissions:
 *   get:
 *     summary: Get all available permissions
 *     tags: [Permissions]
 *     responses:
 *       200:
 *         description: List of all permissions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   uId:
 *                     type: string
 *                   name:
 *                     type: string
 *                   description:
 *                     type: string
 */
adminRoutes.get("/permissions", getAllPermissions);


export default adminRoutes;
