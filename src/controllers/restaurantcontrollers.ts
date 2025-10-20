import type { Request, Response } from "express";
import db from "../config/db.ts";
import type { RowDataPacket, ResultSetHeader } from "mysql2";
import { cloudinaryUpload } from "../utils/uploadCloudinary.ts";

/**
 * ✅ Create a restaurant (with image upload)
 */
export const createRestaurant = async (req: Request, res: Response): Promise<void> => {
  try {
    const { restaurant_name, address, location } = req.body;

    if (!restaurant_name || !address || !location) {
      res.status(400).json({ message: "restaurant_name, address and location are required" });
      return;
    }

    let imageUrl: string | null = null;
    if (req.file) {
      imageUrl = await cloudinaryUpload(req.file.buffer);
    }

    const [result] = await db.query<ResultSetHeader>(
      "INSERT INTO restaurants (restaurant_name, address, location, image) VALUES (?, ?, ?, ?)",
      [restaurant_name, address, location, imageUrl]
    );

    res.status(201).json({
      message: "Restaurant registered successfully",
      restaurantId: result.insertId,
      image_url: imageUrl,
    });
  } catch (error: any) {
    console.error("createRestaurant error:", error);
    res.status(500).json({ error: "Failed to create restaurant" });
  }
};

/** Get All Restaurants */
export const getAllRestaurant = async (_req: Request, res: Response): Promise<void> => {
  try {
    const [rows] = await db.query<RowDataPacket[]>(
      "SELECT id, restaurant_name, address, location, image, created_at, updated_at FROM restaurants"
    );

    res.status(200).json(rows);
  } catch (error: any) {
    console.error("getAllRestaurant error:", error);
    res.status(500).json({ error: "Failed to fetch restaurants" });
  }
};


/**
 * ✅ Get single restaurant by ID
 */
export const getRestaurantById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const [rows] = await db.query<RowDataPacket[]>(
      "SELECT id, restaurant_name, address, location, image, created_at, updated_at FROM restaurants WHERE id = ?",
      [id]
    );

    if (rows.length === 0) {
      res.status(404).json({ message: "Restaurant not found" });
      return;
    }

    res.status(200).json(rows[0]);
  } catch (error: any) {
    console.error("getRestaurantById error:", error);
    res.status(500).json({ error: "Failed to fetch restaurant" });
  }
};

/**
 * ✅ Update restaurant (with optional image)
 */
export const updateRestaurant = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { restaurant_name, address, location } = req.body;

    // Upload new image if provided
    let image: string | null = null;
    if (req.file) {
      image = await cloudinaryUpload(req.file.buffer);
    }

    const [result] = await db.query<ResultSetHeader>(
      `UPDATE restaurants 
       SET 
         restaurant_name = COALESCE(?, restaurant_name),
         address = COALESCE(?, address),
         location = COALESCE(?, location),
         image = COALESCE(?, image),
         updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [restaurant_name ?? null, address ?? null, location ?? null, image, id]
    );

    if (result.affectedRows === 0) {
      res.status(404).json({ message: "Restaurant not found" });
      return;
    }

    res.status(200).json({ message: "Restaurant updated successfully", image: image });
  } catch (error: any) {
    console.error("updateRestaurant error:", error);
    res.status(500).json({ error: "Failed to update restaurant" });
  }
};

/**
 * ✅ Delete restaurant by ID
 */
export const deleteRestaurant = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const [result] = await db.query<ResultSetHeader>(
      "DELETE FROM restaurants WHERE id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      res.status(404).json({ message: "Restaurant not found" });
      return;
    }

    res.status(200).json({ message: "Restaurant deleted successfully" });
  } catch (error: any) {
    console.error("deleteRestaurant error:", error);
    res.status(500).json({ error: "Failed to delete restaurant" });
  }
};
