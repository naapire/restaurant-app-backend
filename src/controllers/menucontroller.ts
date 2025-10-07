import type { Request, Response } from "express";
import db from "../config/db.ts";
import type {  ResultSetHeader, RowDataPacket } from "mysql2";
import { cloudinaryUpload } from "../../utils/uploadCloudinary.ts";

/**
 * ✅ Create a menu under a restaurant
 */
export const createMenu = async (req: Request, res: Response): Promise<void> => {
  try {
    const { restaurantId } = req.params;
    const body = req.body || {};
    const name = body.name;
    const promotionDetails = body.promotionDetails;
    const is_available =
      body.is_available === "true" || body.is_available === true ? true : false;

    if (!name) {
      res.status(400).json({ message: "Menu name is required" });
      return;
    }

    // Upload image if provided
    let imageUrl: string | null = null;
    if (req.file) {
      imageUrl = await cloudinaryUpload(req.file.buffer);
    }

    const sql =
      "INSERT INTO menu (name, promotionDetails, is_available, image_url, restaurant_id) VALUES (?, ?, ?, ?, ?)";
    const values = [name, promotionDetails ?? null, is_available, imageUrl, restaurantId];

    const [result] = await db.query<ResultSetHeader>(sql, values);

    res.status(201).json({
      id: result.insertId,
      name,
      promotionDetails,
      is_available,
      image_url: imageUrl,
      restaurant_id: restaurantId,
      message: "Menu created successfully",
    });
  } catch (error: any) {
    console.error("createMenu error:", error);
    res.status(500).json({ error: "Failed to create menu" });
  }
};

/**
 * ✅ Get all menus across all restaurants
 */
export const getAllMenus = async (_req: Request, res: Response): Promise<void> => {
  try {
    const [rows] = await db.query<RowDataPacket[]>(
      "SELECT * FROM menu ORDER BY created_at DESC"
    );
    res.status(200).json(rows);
  } catch (error: any) {
    console.error("getAllMenus error:", error);
    res.status(500).json({ error: "Failed to fetch all menus" });
  }
};

/**
 * ✅ Get all menus for a restaurant
 */
export const getMenus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { restaurantId } = req.params;
    const [rows] = await db.query<RowDataPacket[]>(
      "SELECT * FROM menu WHERE restaurant_id = ? ORDER BY created_at DESC",
      [restaurantId]
    );
    res.status(200).json(rows);
  } catch (error: any) {
    console.error("getMenus error:", error);
    res.status(500).json({ error: "Failed to fetch menus" });
  }
};

/**
 * ✅ Get single menu by ID
 */
export const getMenuById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { restaurantId, menuId } = req.params;
    const [rows] = await db.query<RowDataPacket[]>(
      "SELECT * FROM menu WHERE id = ? AND restaurant_id = ?",
      [menuId, restaurantId]
    );
    if (rows.length === 0) {
      res.status(404).json({ message: "Menu not found" });
      return;
    }
    res.status(200).json(rows[0]);
  } catch (error: any) {
    console.error("getMenuById error:", error);
    res.status(500).json({ error: "Failed to fetch menu" });
  }
};

/**
 * ✅ Update a menu
 */
export const updateMenu = async (req: Request, res: Response): Promise<void> => {
  try {
    const { restaurantId, menuId } = req.params;
    const body = req.body || {};
    const name = body.name;
    const promotionDetails = body.promotionDetails;
    const is_available =
      body.is_available === "true" || body.is_available === true ? true : false;

    // Upload new image if provided
    let imageUrl: string | null = null;
    if (req.file) {
      imageUrl = await cloudinaryUpload(req.file.buffer);
    }

    const sql = `
      UPDATE menu 
      SET 
        name = COALESCE(?, name), 
        promotionDetails = COALESCE(?, promotionDetails), 
        is_available = COALESCE(?, is_available), 
        image_url = COALESCE(?, image_url)
      WHERE id = ? AND restaurant_id = ?
    `;

    const [result] = await db.query<ResultSetHeader>(sql, [
      name ?? null,
      promotionDetails ?? null,
      is_available,
      imageUrl,
      menuId,
      restaurantId,
    ]);

    if (result.affectedRows === 0) {
      res.status(404).json({ message: "Menu not found" });
      return;
    }

    const [updatedMenu] = await db.query<RowDataPacket[]>(
      "SELECT * FROM menu WHERE id = ? AND restaurant_id = ?",
      [menuId, restaurantId]
    );

    res.status(200).json({
      message: "Menu updated successfully",
      ...updatedMenu[0],
    });
  } catch (error: any) {
    console.error("updateMenu error:", error);
    res.status(500).json({ error: "Failed to update menu" });
  }
};

/**
 * ✅ Delete a menu
 */
export const deleteMenu = async (req: Request, res: Response): Promise<void> => {
  try {
    const { restaurantId, menuId } = req.params;

    const [result] = await db.query<ResultSetHeader>(
      "DELETE FROM menu WHERE id = ? AND restaurant_id = ?",
      [menuId, restaurantId]
    );

    if (result.affectedRows === 0) {
      res.status(404).json({ message: "Menu not found" });
      return;
    }

    res.status(200).json({ message: "Menu deleted successfully" });
  } catch (error: any) {
    console.error("deleteMenu error:", error);
    res.status(500).json({ error: "Failed to delete menu" });
  }
};
