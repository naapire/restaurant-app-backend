import type { Request, Response } from "express";
import db from "../config/db.ts";
import type { RowDataPacket, ResultSetHeader } from "mysql2";
import { cloudinaryUpload } from "../utils/uploadCloudinary.ts";


export const createMenuItem = async (req: Request, res: Response): Promise<void> => {
  try {
    const { restaurantId, menuId } = req.params;
    const { name, deliverySpeed, deliveryFee, image, price } = req.body;

    if (!name || !deliverySpeed || !deliveryFee || !price) {
      res.status(400).json({ error: "Missing required fields." });
      return;
    }

    // ✅ Upload image if provided
    let imageUrl: string | null = null;
    if (req.file) {
      imageUrl = await cloudinaryUpload(req.file.buffer);
    }

    const sql = `
      INSERT INTO menuItems (name, menu_id, deliverySpeed, deliveryFee, price, image, restaurant_id) 
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [
      name,
      menuId,
      deliverySpeed,
      parseFloat(deliveryFee),
      parseFloat(price),
      image,
      restaurantId,
    ];

    const [result] = await db.query<ResultSetHeader>(sql, values);

    // ✅ Fetch the created item
    const [rows] = await db.query<RowDataPacket[]>(
      `SELECT * FROM menuItems WHERE id = ?`,
      [result.insertId]
    );

    const item = rows[0];
    item.deliveryFee = item.deliveryFee ? Number(item.deliveryFee) : null;
    item.price = item.price ? Number(item.price) : null;
    item.image = imageUrl;

    res.status(201).json({
      message: "Menu item created successfully",
      ...item,
    });
  } catch (err) {
    console.error("Error creating menu item:", err);
    res.status(500).json({ error: "Failed to create menu item." });
  }
};

// ✅ Get all menuItems (across all restaurants/menus)
export const getAllMenuItems = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const [results] = await db.query<RowDataPacket[]>(
      `SELECT mi.*, m.name AS menu_name, r.restaurant_name AS restaurant_name
       FROM menuItems mi
       JOIN menu m ON mi.menu_id = m.id
       JOIN restaurants r ON mi.restaurant_id = r.id
       ORDER BY mi.created_at DESC`.
    );

    res.json(results);
  } catch (err) {
    console.error("Error fetching all menu items:", err);
    res.status(500).json({ error: "Failed to fetch all menu items." });
  }
};

// ✅ Get all menuItems under a menu
export const getMenuItems = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { restaurantId, menuId } = req.params;

    const [results] = await db.query<RowDataPacket[]>(
      `SELECT * FROM menuItems WHERE restaurant_id = ? AND menu_id = ?`,
      [restaurantId, menuId]
    );

    // ✅ Convert string numbers to real numbers
    const formatted = results.map((item: any) => ({
      ...item,
      deliveryFee: item.deliveryFee ? Number(item.deliveryFee) : null,
      price: item.price ? Number(item.price) : null,
    }));

    res.json(formatted);
  } catch (err) {
    console.error("Error fetching menu items:", err);
    res.status(500).json({ error: "Failed to fetch menu items." });
  }
};

// ✅ Get single menuItem by ID
export const getMenuItemById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { restaurantId, menuId, itemId } = req.params;

    const [results] = await db.query<RowDataPacket[]>(
      `SELECT * FROM menuItems WHERE id = ? AND menu_id = ? AND restaurant_id = ?`,
      [itemId, menuId, restaurantId]
    );

    if (results.length === 0) {
      res.status(404).json({ message: "Menu item not found" });
      return;
    }

    // ✅ Convert price to number for a single item as well
    const item = results[0];
    item.price = item.price ? Number(item.price) : null;

    res.json(item);
  } catch (err) {
    console.error("Error fetching menu item:", err);
    res.status(500).json({ error: "Failed to fetch menu item." });
  }
  
};

// ✅ Update a menuItem
export const updateMenuItem = async (req: Request, res: Response): Promise<void> => {
  try {
    const { restaurantId, menuId, itemId } = req.params;
    const { name, deliverySpeed, deliveryFee, price } = req.body;

    // ✅ Upload new image if provided
    let imageUrl: string | null = null;
    if (req.file) {
      imageUrl = await cloudinaryUpload(req.file.buffer);
    }

    const sql = `
      UPDATE menuItems
      SET 
        name = COALESCE(?, name),
        deliverySpeed = COALESCE(?, deliverySpeed),
        deliveryFee = COALESCE(?, deliveryFee),
        price = COALESCE(?, price),
        image = COALESCE(?, image)
      WHERE id = ? AND menu_id = ? AND restaurant_id = ?
    `;

    const values = [
      name ?? null,
      deliverySpeed ?? null,
      deliveryFee ? parseFloat(deliveryFee) : null,
      price ? parseFloat(price) : null,
      imageUrl,
      itemId,
      menuId,
      restaurantId,
    ];

    const [result] = await db.query<ResultSetHeader>(sql, values);

    if (result.affectedRows === 0) {
      res.status(404).json({ error: "Menu item not found" });
      return;
    }

    // ✅ Fetch updated record
    const [rows] = await db.query<RowDataPacket[]>(
      `SELECT * FROM menuItems WHERE id = ?`,
      [itemId]
    );

    const item = rows[0];
    if (item) {
      item.deliveryFee = item.deliveryFee ? Number(item.deliveryFee) : null;
      item.price = item.price ? Number(item.price) : null;
    }

    res.status(200).json({
      message: "Menu item updated successfully",
      ...item,
    });
  } catch (err) {
    console.error("Error updating menu item:", err);
    res.status(500).json({ error: "Failed to update menu item." });
  }
};

// ✅ Delete a menuItem
export const deleteMenuItem = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { restaurantId, menuId, itemId } = req.params;

    const [result] = await db.query<ResultSetHeader>(
      `DELETE FROM menuItems WHERE id = ? AND menu_id = ? AND restaurant_id = ?`,
      [itemId, menuId, restaurantId]
    );

    if (result.affectedRows === 0) {
      res.status(404).json({ message: "Menu item not found" });
      return;
    }

    res.json({ message: "Menu item deleted successfully" });
  } catch (err) {
    console.error("Error deleting menu item:", err);
    res.status(500).json({ error: "Failed to delete menu item." });
  }
};

// ✅ Get all menuItems for a specific restaurant (across all menus)
export const getAllMenuItemsByRestaurant = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { restaurantId } = req.params;

    // ✅ Join menus and restaurant info for richer response
    const [results] = await db.query<RowDataPacket[]>(
      `SELECT mi.*, m.name AS menu_name, r.restaurant_name AS restaurant_name
       FROM menuItems mi
       JOIN menu m ON mi.menu_id = m.id
       JOIN restaurants r ON mi.restaurant_id = r.id
       WHERE mi.restaurant_id = ?
       ORDER BY mi.created_at DESC`,
      [restaurantId]
    );

    // ✅ Convert deliveryFee & price to numbers
    const formatted = results.map((item: any) => ({
      ...item,
      deliveryFee: item.deliveryFee ? Number(item.deliveryFee) : null,
      price: item.price ? Number(item.price) : null,
    }));

    res.json(formatted);
  } catch (err) {
    console.error("Error fetching menu items for restaurant:", err);
    res.status(500).json({ error: "Failed to fetch menu items for this restaurant." });
  }
};

