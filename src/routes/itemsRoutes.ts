import express from "express";
import {
  createMenuItem,
  getMenuItems,
  getMenuItemById,
  updateMenuItem,
  deleteMenuItem,
  getAllMenuItems,
  getAllMenuItemsByRestaurant
} from "../controllers/menuitems.ts";
import upload, { uploadToCloudinary } from "../middleware/upload.ts";

const menuItemRoutes = express.Router();

/**
 * @swagger
 * tags:
 *   name: MenuItems
 *   description: API endpoints for managing menu items
 */

/**
 * @swagger
 * /restaurants/{restaurantId}/menus/{menuId}/menuItems:
 *   post:
 *     summary: Create a new menu item under a specific menu
 *     tags: [MenuItems]
 *     parameters:
 *       - name: restaurantId
 *         in: path
 *         required: true
 *         description: ID of the restaurant
 *         schema:
 *           type: integer
 *       - name: menuId
 *         in: path
 *         required: true
 *         description: ID of the menu
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Classic Burger"
 *               description:
 *                 type: string
 *                 example: "Grilled beef burger with cheese and lettuce"
 *               price:
 *                 type: number
 *                 example: 12.5
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Menu item created successfully
 *       400:
 *         description: Invalid data
 *       500:
 *         description: Server error
 */
menuItemRoutes.post(
  "/restaurants/:restaurantId/menus/:menuId/menuItems",
  upload.single("image"),
  uploadToCloudinary,
  createMenuItem
);

/**
 * @swagger
 * /restaurants/{restaurantId}/menus/{menuId}/menuItems/{itemId}:
 *   put:
 *     summary: Update an existing menu item
 *     tags: [MenuItems]
 *     parameters:
 *       - name: restaurantId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *       - name: menuId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *       - name: itemId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: false
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Menu item updated successfully
 *       404:
 *         description: Menu item not found
 *       500:
 *         description: Server error
 */
menuItemRoutes.put(
  "/restaurants/:restaurantId/menus/:menuId/menuItems/:itemId",
  upload.single("image"),
  uploadToCloudinary,
  updateMenuItem
);

/**
 * @swagger
 * /menuItems:
 *   get:
 *     summary: Get all menu items across all restaurants
 *     tags: [MenuItems]
 *     responses:
 *       200:
 *         description: List of all menu items
 *       500:
 *         description: Server error
 */
menuItemRoutes.get("/menuItems", getAllMenuItems);

/**
 * @swagger
 * /restaurants/{restaurantId}/menus/{menuId}/menuItems:
 *   get:
 *     summary: Get all menu items under a specific menu
 *     tags: [MenuItems]
 *     parameters:
 *       - name: restaurantId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *       - name: menuId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of menu items for a given menu
 *       404:
 *         description: Menu not found
 *       500:
 *         description: Server error
 */
menuItemRoutes.get(
  "/restaurants/:restaurantId/menus/:menuId/menuItems",
  getMenuItems
);

/**
 * @swagger
 * /restaurants/{restaurantId}/menus/{menuId}/menuItems/{itemId}:
 *   get:
 *     summary: Get a single menu item by ID
 *     tags: [MenuItems]
 *     parameters:
 *       - name: restaurantId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *       - name: menuId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *       - name: itemId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Menu item details
 *       404:
 *         description: Menu item not found
 */
menuItemRoutes.get(
  "/restaurants/:restaurantId/menus/:menuId/menuItems/:itemId",
  getMenuItemById
);

/**
 * @swagger
 * /restaurants/{restaurantId}/menus/{menuId}/menuItems/{itemId}:
 *   delete:
 *     summary: Delete a menu item by ID
 *     tags: [MenuItems]
 *     parameters:
 *       - name: restaurantId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *       - name: menuId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *       - name: itemId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Menu item deleted successfully
 *       404:
 *         description: Menu item not found
 */
menuItemRoutes.delete(
  "/restaurants/:restaurantId/menus/:menuId/menuItems/:itemId",
  deleteMenuItem
);

/**
 * @swagger
 * /restaurants/{restaurantId}/menuitems:
 *   get:
 *     summary: Get all menu items in a restaurant (across all menus)
 *     description: Retrieve all menu items that belong to a specific restaurant, regardless of which menu they belong to.
 *     tags: [MenuItems]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: restaurantId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the restaurant to fetch menu items for.
 *     responses:
 *       200:
 *         description: List of all menu items in the restaurant.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/MenuItem'
 *       401:
 *         description: Unauthorized - Missing or invalid token.
 *       403:
 *         description: Forbidden - Only managers or admins can access this route.
 *       500:
 *         description: Failed to fetch menu items.
 */
menuItemRoutes.get(
  "/restaurants/:restaurantId/menuitems",
  
  getAllMenuItemsByRestaurant
);

export default menuItemRoutes;
