import express from "express";
import {
  createRole,
  getRoles,
  getRoleById,
  updateRole,
  deleteRole,
} from "../controllers/rolescontroller.ts";

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Permission:
 *       type: object
 *       properties:
 *         uId:
 *           type: string
 *           description: UUID of the permission
 *         name:
 *           type: string
 *           description: Name of the permission
 *         description:
 *           type: string
 *           description: Description of the permission
 *     Role:
 *       type: object
 *       properties:
 *         uId:
 *           type: string
 *           description: UUID of the role
 *         name:
 *           type: string
 *           description: Name of the role
 *         description:
 *           type: string
 *           description: Description of the role
 *         permission_count:
 *           type: integer
 *           description: Number of assigned permissions
 *         permissions:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Permission'
 *     CreateRoleRequest:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         name:
 *           type: string
 *           example: Manager
 *         description:
 *           type: string
 *           example: Can manage restaurant operations
 *         permissionUIds:
 *           type: array
 *           items:
 *             type: string
 *           example: ["uuid1", "uuid2"]
 */

/**
 * @swagger
 * tags:
 *   - name: Roles
 *     description: Role management APIs
 */

/**
 * @swagger
 * /roles:
 *   post:
 *     summary: Create a new role with permissions
 *     tags: [Roles]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateRoleRequest'
 *     responses:
 *       201:
 *         description: Role created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Role'
 */
router.post("/roles", createRole);

/**
 * @swagger
 * /roles:
 *   get:
 *     summary: Get all roles with permissions
 *     tags: [Roles]
 *     responses:
 *       200:
 *         description: List of all roles
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Role'
 */
router.get("/roles", getRoles);

/**
 * @swagger
 * /roles/{uId}:
 *   get:
 *     summary: Get a role by UUID with permissions
 *     tags: [Roles]
 *     parameters:
 *       - in: path
 *         name: uId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Role fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Role'
 *       404:
 *         description: Role not found
 */
router.get("/roles/:uId", getRoleById);

/**
 * @swagger
 * /roles/{uId}:
 *   put:
 *     summary: Update a role and its permissions by UUID
 *     tags: [Roles]
 *     parameters:
 *       - in: path
 *         name: uId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateRoleRequest'
 *     responses:
 *       200:
 *         description: Role updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Role'
 *       404:
 *         description: Role not found
 */
router.put("/roles/:uId", updateRole);

/**
 * @swagger
 * /roles/{uId}:
 *   delete:
 *     summary: Delete a role and its permissions by UUID
 *     tags: [Roles]
 *     parameters:
 *       - in: path
 *         name: uId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Role deleted successfully
 *       404:
 *         description: Role not found
 */
router.delete("/roles/:uId", deleteRole);

export default router;
