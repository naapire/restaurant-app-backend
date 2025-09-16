import type{ Request, Response } from "express";
import db from "../config/db.ts"; 
import type{ RowDataPacket } from "mysql2";

export const createMenu = (req: Request, res: Response): void => {
  const { restaurantId } = req.params;
  const { name, promotionDetails, is_available, image_url } = req.body as {
    name: string,
    promotionDetails: string,
    is_available: boolean,
    image_url: string
  };
    if (!name || !is_available || image_url){
        res.status(400).json({message: "must provide all credentials"});
        return;
    }

  db.query(
    "INSERT INTO menu (name, promotionDetails, is_available, image_url, restaurant_id) VALUES (?, ?, ?, ?, ?)",
    [name, promotionDetails, is_available ?? true, image_url, restaurantId],
    (err, result) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.status(201).json({ message: "Menu created successfully", menuId: (result as any).insertId });
    }
  );
};

export const getMenus = (req: Request, res: Response): void => {
  const { restaurantId } = req.params;

  db.query<RowDataPacket[]>(
    "SELECT * FROM menu WHERE restaurant_id = ?",
    [restaurantId],
    (err, results) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json(results);
    }
  );
};


export const getMenuById = (req: Request, res: Response): void => {
  const { restaurantId, menuId } = req.params;

  db.query<RowDataPacket[]>(
    "SELECT * FROM menu WHERE id = ? AND restaurant_id = ?",
    [menuId, restaurantId],
    (err, results) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      if (results.length === 0) {
        res.status(404).json({ message: "Menu not found" });
        return;
      }
      res.json(results[0]);
    }
  );
};

export const updateMenu = (req: Request, res: Response): void => {
  const { restaurantId, menuId } = req.params;
  const { name, promotionDetails, is_available, image_url } = req.body as {
    name: string,
    promotionDetails: string,
    is_available: boolean,
    image_url: string
  };

  db.query(
    "UPDATE menu SET name = ?, promotionDetails = ?, is_available = ?, image_url = ? WHERE id = ? AND restaurant_id = ?",
    [name, promotionDetails, is_available, image_url, menuId, restaurantId],
    (err, result) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      if ((result as any).affectedRows === 0) {
        res.status(404).json({ message: "Menu not found" });
        return;
      }
      res.json({ message: "Menu updated successfully" });
    }
  );
};

export const deleteMenu = (req: Request, res: Response): void => {
  const { restaurantId, menuId } = req.params;

  db.query(
    "DELETE FROM menu WHERE id = ? AND restaurant_id = ?",
    [menuId, restaurantId],
    (err, result) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      if ((result as any).affectedRows === 0) {
        res.status(404).json({ message: "Menu not found" });
        return;
      }
      res.json({ message: "Menu deleted successfully" });
    }
);
};