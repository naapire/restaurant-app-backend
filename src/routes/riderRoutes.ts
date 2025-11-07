import express from "express";
import {
  getAllRiders,
  getRiderById,
  updateRiderStatus,
  deleteRider,
  createRider,
  assignRiderToOrder,
} from "../controllers/riderscontroller.ts";
import { authMiddleware, isAdmin } from "../middleware/authmiddleware.ts";

const riderRoutes = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Rider:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         user_id:
 *           type: integer
 *         availability_status:
 *           type: string
 *           enum: [available, busy, offline]
 *         rating:
 *           type: number
 *           format: float
 *           nullable: true
 *         created_at:
 *           type: string
 *           format: date-time
 *         updated_at:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /riders:
 *   post:
 *     summary: Create a new rider (admin only)
 *     tags: [Riders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user_id
 *             properties:
 *               user_id:
 *                 type: integer
 *               availability_status:
 *                 type: string
 *                 enum: [available, busy, offline]
 *                 default: available
 *     responses:
 *       201:
 *         description: Rider created successfully
 */
riderRoutes.post("/riders", authMiddleware, isAdmin, createRider);

/**
 * @swagger
 * /riders:
 *   get:
 *     summary: Get all riders (admin only)
 *     tags: [Riders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of riders
 */
riderRoutes.get("/riders", authMiddleware, isAdmin, getAllRiders);

/**
 * @swagger
 * /riders/{id}:
 *   get:
 *     summary: Get a rider by id (admin only)
 *     tags: [Riders]
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
 *         description: Rider object
 */
riderRoutes.get("/riders/:id", authMiddleware, isAdmin, getRiderById);

/**
 * @swagger
 * /riders/{id}:
 *   put:
 *     summary: Update a rider's availability status (admin only)
 *     tags: [Riders]
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
 *               - availability_status
 *             properties:
 *               availability_status:
 *                 type: string
 *                 enum: [available, busy, offline]
 *     responses:
 *       200:
 *         description: Rider status updated successfully
 */
riderRoutes.put("/riders/:id", authMiddleware, isAdmin, updateRiderStatus);

/**
 * @swagger
 * /riders/{id}:
 *   delete:
 *     summary: Delete a rider by id (admin only)
 *     tags: [Riders]
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
 *         description: Rider deleted successfully
 */
riderRoutes.delete("/riders/:id", authMiddleware, isAdmin, deleteRider);

/**
 * @swagger
 * /riders/assign:
 *   post:
 *     summary: Assign a rider to an order (admin only)
 *     tags: [Riders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - order_id
 *               - rider_id
 *             properties:
 *               order_id:
 *                 type: integer
 *               rider_id:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Rider assigned successfully
 */
riderRoutes.post("/riders/assign", authMiddleware, isAdmin, assignRiderToOrder);

export default riderRoutes;
