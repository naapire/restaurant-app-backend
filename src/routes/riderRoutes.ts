import express from "express";
import {
  getAllRiders,
  getRiderById,
  updateRiderStatus,
  deleteRider,
} from "../controllers/riderscontroller.ts";

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
 *   get:
 *     summary: Get all riders
 *     tags: [Riders]
 *     responses:
 *       200:
 *         description: List of riders
 */
riderRoutes.get("/riders", getAllRiders);

/**
 * @swagger
 * /riders/{id}:
 *   get:
 *     summary: Get a rider by id
 *     tags: [Riders]
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
riderRoutes.get("/riders/:id", getRiderById);

/**
 * @swagger
 * /riders/{id}:
 *   put:
 *     summary: Update a rider's availability status
 *     tags: [Riders]
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
riderRoutes.put("/riders/:id", updateRiderStatus);

/**
 * @swagger
 * /riders/{id}:
 *   delete:
 *     summary: Delete a rider by id
 *     tags: [Riders]
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
riderRoutes.delete("/riders/:id", deleteRider);

export default riderRoutes;
