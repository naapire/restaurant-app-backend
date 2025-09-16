import type { Request, Response } from "express";
import db from "../config/db.ts";
import type { RowDataPacket } from "mysql2";

// Create a menuItem under a menu
export const createMenuItem = (req: Request, res: Response): void => {
  const { restaurantId, menuId } = req.params;
  const { name, deliverySpeed, deliveryFee, image } = req.body;

  db.query(
    `INSERT INTO menuItems (name, menu_id, deliverySpeed, deliveryFee, image, restaurant_id) 
     VALUES (?, ?, ?, ?, ?, ?)`,
    [name, menuId, deliverySpeed, deliveryFee, image, restaurantId],
    (err, result) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.status(201).json({
        message: "Menu item created successfully",
        itemId: (result as any).insertId,
      });
    }
  );
};

// Get all menuItems under a menu
export const getMenuItems = (req: Request, res: Response): void => {
  const { restaurantId, menuId } = req.params;

  db.query<RowDataPacket[]>(
    `SELECT * FROM menuItems WHERE restaurant_id = ? AND menu_id = ?`,
    [restaurantId, menuId],
    (err, results) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json(results);
    }
  );
};

// Get single menuItem by ID
export const getMenuItemById = (req: Request, res: Response): void => {
  const { restaurantId, menuId, itemId } = req.params;

  db.query<RowDataPacket[]>(
    `SELECT * FROM menuItems WHERE id = ? AND menu_id = ? AND restaurant_id = ?`,
    [itemId, menuId, restaurantId],
    (err, results) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      if (results.length === 0) {
        res.status(404).json({ message: "Menu item not found" });
        return;
      }
      res.json(results[0]);
    }
  );
};

// Update a menuItem
export const updateMenuItem = (req: Request, res: Response): void => {
  const { restaurantId, menuId, itemId } = req.params;
  const { name, deliverySpeed, deliveryFee, image } = req.body;

  db.query(
    `UPDATE menuItems SET name = ?, deliverySpeed = ?, deliveryFee = ?, image = ? 
     WHERE id = ? AND menu_id = ? AND restaurant_id = ?`,
    [name, deliverySpeed, deliveryFee, image, itemId, menuId, restaurantId],
    (err, result) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      if ((result as any).affectedRows === 0) {
        res.status(404).json({ message: "Menu item not found" });
        return;
      }
      res.json({ message: "Menu item updated successfully" });
    }
  );
};

// Delete a menuItem
export const deleteMenuItem = (req: Request, res: Response): void => {
  const { restaurantId, menuId, itemId } = req.params;

  db.query(
    `DELETE FROM menuItems WHERE id = ? AND menu_id = ? AND restaurant_id = ?`,
    [itemId, menuId, restaurantId],
    (err, result) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      if ((result as any).affectedRows === 0) {
        res.status(404).json({ message: "Menu item not found" });
        return;
      }
      res.json({ message: "Menu item deleted successfully" });
    }
  );
};
