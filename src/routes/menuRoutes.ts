import express from "express";
import { createMenu, getMenus, getMenuById, updateMenu, deleteMenu } from "../controllers/menucontroller.ts";

const menuRoutes = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Menu:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         promotionDetails:
 *           type: string
 *         is_available:
 *           type: boolean
 *         image_url:
 *           type: string
 */

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
menuRoutes.post("/restaurants/:restaurantId/menus", createMenu);

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
menuRoutes.get("/restaurants/:restaurantId/menus", getMenus);

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
menuRoutes.get("/restaurants/:restaurantId/menus/:menuId", getMenuById);

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
menuRoutes.put("/restaurants/:restaurantId/menus/:menuId", updateMenu);

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
menuRoutes.delete("/restaurants/:restaurantId/menus/:menuId", deleteMenu);
export default menuRoutes;
