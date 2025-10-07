import type { Request, Response } from "express";
import db from "../config/db.ts";
import type { RowDataPacket, ResultSetHeader } from "mysql2";

/**
 * Create a restaurant (admin-only should be enforced in routes/middleware)
 */
export const createRestaurant = async (req: Request, res: Response): Promise<void> => {
  try {
    const { restaurant_name, address, location } = req.body as {
      restaurant_name: string;
      address: string;
      location: string;
    };

    if (!restaurant_name || !address || !location) {
      res.status(400).json({ message: "restaurant_name, address and location are required" });
      return;
    }

    const [result] = await db.query<ResultSetHeader>(
      "INSERT INTO restaurants (restaurant_name, address, location) VALUES (?, ?, ?)",
      [restaurant_name, address, location]
    );

    res.status(201).json({
      message: "Restaurant registered successfully",
      restaurantId: result.insertId,
    });
  } catch (error: any) {
    console.error("createRestaurant error:", error);
    res.status(500).json({ error: "Failed to create restaurant" });
  }
};

/**
 * Get all restaurants (public)
 */
export const getAllRestaurant = async (req: Request, res: Response): Promise<void> => {
  try {
    const [rows] = await db.query<RowDataPacket[]>(
      "SELECT id, restaurant_name, address, location, created_at, updated_at FROM restaurants"
    );

    res.status(200).json(rows);
  } catch (error: any) {
    console.error("getAllRestaurant error:", error);
    res.status(500).json({ error: "Failed to fetch restaurants" });
  }
};

/**
 * Get a single restaurant by id
 */
export const getRestaurantById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const [rows] = await db.query<RowDataPacket[]>(
      "SELECT id, restaurant_name, address, location, created_at, updated_at FROM restaurants WHERE id = ?",
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
 * Update restaurant by id
 */
export const updateRestaurant = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { restaurant_name, address, location } = req.body as {
      restaurant_name?: string;
      address?: string;
      location?: string;
    };

    // Use COALESCE-like behavior so partial updates are allowed
    const [result] = await db.query<ResultSetHeader>(
      `UPDATE restaurants
       SET restaurant_name = COALESCE(?, restaurant_name),
           address = COALESCE(?, address),
           location = COALESCE(?, location),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [restaurant_name ?? null, address ?? null, location ?? null, id]
    );

    if (result.affectedRows === 0) {
      res.status(404).json({ message: "Restaurant not found" });
      return;
    }

    res.status(200).json({ message: "Restaurant updated successfully" });
  } catch (error: any) {
    console.error("updateRestaurant error:", error);
    res.status(500).json({ error: "Failed to update restaurant" });
  }
};

/**
 * Delete restaurant by id
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
