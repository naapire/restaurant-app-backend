import type { Request, Response } from "express";
import db from "../config/db.ts";
import type { RowDataPacket, ResultSetHeader } from "mysql2";
import { cloudinaryUpload } from "../../utils/uploadCloudinary.ts";

// ✅ Create a menuItem under a menu
export const createMenuItem = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { restaurantId, menuId } = req.params;
    const { name, deliverySpeed, deliveryFee, price } = req.body;

    const imageUrl: string | null = (req as any).cloudinaryUrl || null;


    const sql = `
      INSERT INTO menuItems (name, menu_id, deliverySpeed, deliveryFee, price, image, restaurant_id) 
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [
      name,
      menuId,
      deliverySpeed,
      deliveryFee,
      price,
      imageUrl,
      restaurantId,
    ];
    const [result] = await db.query<ResultSetHeader>(sql, values);

    // 🔹 Fetch the full created item
    const [rows] = await db.query<RowDataPacket[]>(
      `SELECT * FROM menuItems WHERE id = ?`,
      [result.insertId]
    );

    const item = rows[0];
    // ✅ Convert numeric fields so frontend gets numbers, not strings
    item.deliveryFee = item.deliveryFee ? Number(item.deliveryFee) : null;
    item.price = item.price ? Number(item.price) : null;

    res.status(201).json(item);
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
       ORDER BY mi.created_at DESC`
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

    // ✅ Cloudinary URL will be attached by middleware if image was uploaded
    const imageUrl: string | null = (req as any).cloudinaryUrl || null;

    // ✅ Validate required fields (avoid 400 errors)
    if (!name || !deliverySpeed || !deliveryFee || !price) {
      res.status(400).json({ error: "Missing required fields." });
      return;
    }

    // ✅ Ensure numeric fields are valid
    const parsedDeliveryFee = parseFloat(deliveryFee);
    const parsedPrice = parseFloat(price);

    if (isNaN(parsedDeliveryFee) || isNaN(parsedPrice)) {
      res.status(400).json({ error: "Invalid number format for deliveryFee or price." });
      return;
    }

    // ✅ Update query (preserves old image if no new one provided)
    const sql = `
      UPDATE menuItems
      SET name = ?, deliverySpeed = ?, deliveryFee = ?, price = ?, image = IFNULL(?, image)
      WHERE id = ? AND menu_id = ? AND restaurant_id = ?
    `;

    const values = [
      name,
      deliverySpeed,
      parsedDeliveryFee,
      parsedPrice,
      imageUrl,
      itemId,
      menuId,
      restaurantId,
    ];

    const [result] = await db.query<ResultSetHeader>(sql, values);

    // ✅ Handle case where no rows were updated
    if (result.affectedRows === 0) {
      res.status(404).json({ error: "Menu item not found or no changes made." });
      return;
    }

    // ✅ Fetch updated record
    const [rows] = await db.query<RowDataPacket[]>(`SELECT * FROM menuItems WHERE id = ?`, [
      itemId,
    ]);

    const item = rows[0];
    if (item) {
      item.deliveryFee = item.deliveryFee ? Number(item.deliveryFee) : null;
      item.price = item.price ? Number(item.price) : null;
    }

    res.json({
      message: "Menu item updated successfully",
      item,
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
