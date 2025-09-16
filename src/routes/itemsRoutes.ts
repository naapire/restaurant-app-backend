import express from "express";
import {
  createMenuItem,
  getMenuItems,
  getMenuItemById,
  updateMenuItem,
  deleteMenuItem,
} from "../controllers/menuitems.ts";

const menuItemRoutes = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     MenuItem:
 *       type: object
 *       properties:
 *         
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         price:
 *           type: number
 *           format: float
 *         is_available:
 *           type: boolean
 *         menu_id:
 *           type: integer
 *         restaurant_id:
 *           type: integer
 */

/**
 * @swagger
 * /restaurants/{restaurantId}/menus/{menuId}/menuItems:
 *   post:
 *     summary: Create a menu item under a menu
 *     tags: [MenuItems]
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
 *             $ref: '#/components/schemas/MenuItem'
 *     responses:
 *       201:
 *         description: Menu item created successfully
 */
menuItemRoutes.post("/restaurants/:restaurantId/menus/:menuId/menuItems", createMenuItem);

/**
 * @swagger
 * /restaurants/{restaurantId}/menus/{menuId}/menuItems:
 *   get:
 *     summary: Get all menu items under a menu
 *     tags: [MenuItems]
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
 *         description: List of menu items
 */
menuItemRoutes.get("/restaurants/:restaurantId/menus/:menuId/menuItems", getMenuItems);

/**
 * @swagger
 * /restaurants/{restaurantId}/menus/{menuId}/menuItems/{itemId}:
 *   get:
 *     summary: Get a single menu item by ID
 *     tags: [MenuItems]
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
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Menu item object
 */
menuItemRoutes.get("/restaurants/:restaurantId/menus/:menuId/menuItems/:itemId", getMenuItemById);

/**
 * @swagger
 * /restaurants/{restaurantId}/menus/{menuId}/menuItems/{itemId}:
 *   put:
 *     summary: Update a menu item by ID
 *     tags: [MenuItems]
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
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MenuItem'
 *     responses:
 *       200:
 *         description: Menu item updated successfully
 */
menuItemRoutes.put("/restaurants/:restaurantId/menus/:menuId/menuItems/:itemId", updateMenuItem);

/**
 * @swagger
 * /restaurants/{restaurantId}/menus/{menuId}/menuItems/{itemId}:
 *   delete:
 *     summary: Delete a menu item by ID
 *     tags: [MenuItems]
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
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Menu item deleted successfully
 */
menuItemRoutes.delete("/restaurants/:restaurantId/menus/:menuId/menuItems/:itemId", deleteMenuItem);

export default menuItemRoutes;
