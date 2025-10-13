import express from "express";
import multer from "multer";
import {
  createMenu,
  getMenus,
  getMenuById,
  updateMenu,
  deleteMenu,
  getAllMenus
} from "../controllers/menucontroller.ts";

const menuRoutes = express.Router();

// ✅ Configure Multer for file uploads (store in memory for Cloudinary)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// ========================= Swagger Documentation ========================= //
/**
 * @swagger
 * components:
 *   schemas:
 *     Menu:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         restaurant_id:
 *           type: integer
 *         name:
 *           type: string
 *         promotionDetails:
 *           type: string
 *         is_available:
 *           type: boolean
 *         image_url:
 *           type: string
 *           nullable: true
 */

/**
 * @swagger
 * /restaurants/{restaurantId}/menus:
 *   get:
 *     summary: Get all menus for a restaurant
 *     tags: [Menu]
 *     parameters:
 *       - in: path
 *         name: restaurantId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of menus
 *
 *   post:
 *     summary: Create a new menu for a restaurant
 *     tags: [Menu]
 *     parameters:
 *       - in: path
 *         name: restaurantId
 *         required: true
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
 *               promotionDetails:
 *                 type: string
 *               is_available:
 *                 type: boolean
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Menu created successfully
 */

/**
 * @swagger
 * /restaurants/{restaurantId}/menus/{menuId}:
 *   get:
 *     summary: Get menu by ID
 *     tags: [Menu]
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
 *         description: Menu found
 *
 *   put:
 *     summary: Update a menu
 *     tags: [Menu]
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
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               promotionDetails:
 *                 type: string
 *               is_available:
 *                 type: boolean
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Menu updated successfully
 *
 *   delete:
 *     summary: Delete a menu
 *     tags: [Menu]
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
// ======================================================================== //

// ✅ Routes
menuRoutes.post(
  "/restaurants/:restaurantId/menus",
  upload.single("image"),
  createMenu
);

menuRoutes.get("/restaurants/:restaurantId/menus", getMenus);

menuRoutes.get("/menus", getAllMenus);

menuRoutes.get("/restaurants/:restaurantId/menus/:menuId", getMenuById);

menuRoutes.put(
  "/restaurants/:restaurantId/menus/:menuId",
  upload.single("image"),
  updateMenu
);

menuRoutes.delete("/restaurants/:restaurantId/menus/:menuId", deleteMenu);

export default menuRoutes;
