import express from "express";
import {
  createMenuItem,
  getMenuItems,
  getMenuItemById,
  updateMenuItem,
  deleteMenuItem,
  getAllMenuItems,
} from "../controllers/menuitems.ts";
import upload, { uploadToCloudinary } from "../middleware/upload.ts";

const menuItemRoutes = express.Router();

/**
 * @swagger
 * /restaurants/{restaurantId}/menus/{menuId}/menuItems:
 *   post:
 *     summary: Create a menu item under a menu
 *     tags: [MenuItems]
 */
menuItemRoutes.post(
  "/restaurants/:restaurantId/menus/:menuId/menuItems",
  upload.single("image"),   // 1️⃣ multer saves temp file
  uploadToCloudinary,       // 2️⃣ upload it to Cloudinary & attach req.cloudinaryUrl
  createMenuItem            // 3️⃣ controller uses req.cloudinaryUrl
);

/**
 * @swagger
 * /restaurants/{restaurantId}/menus/{menuId}/menuItems/{itemId}:
 *   put:
 *     summary: Update a menu item by ID
 *     tags: [MenuItems]
 */
menuItemRoutes.put(
  "/restaurants/:restaurantId/menus/:menuId/menuItems/:itemId",
  upload.single("image"),
  uploadToCloudinary,
  updateMenuItem
);

// Other routes remain the same
menuItemRoutes.get("/menuItems", getAllMenuItems);
menuItemRoutes.get("/restaurants/:restaurantId/menus/:menuId/menuItems", getMenuItems);
menuItemRoutes.get("/restaurants/:restaurantId/menus/:menuId/menuItems/:itemId", getMenuItemById);
menuItemRoutes.delete("/restaurants/:restaurantId/menus/:menuId/menuItems/:itemId", deleteMenuItem);

export default menuItemRoutes;
