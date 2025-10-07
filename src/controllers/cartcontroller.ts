// src/controllers/cartController.ts
import type{ Request, Response } from "express";
import db from "../config/db.ts";
import type{ RowDataPacket, ResultSetHeader } from "mysql2/promise";

// ✅ Add item to cart
export const addToCart = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { menu_item_id, quantity, price } = req.body;

    if (!menu_item_id || !quantity || !price) {
      return res.status(400).json({ message: "menu_item_id, quantity, and price are required" });
    }

    const [result] = await db.query<ResultSetHeader>(
      "INSERT INTO cart (user_id, menu_item_id, quantity, price) VALUES (?, ?, ?, ?)",
      [userId, menu_item_id, quantity, price]
    );

    res.status(201).json({
      message: "Item added to cart",
      cartId: result.insertId,
    });
  } catch (error: any) {
    console.error("Error adding to cart:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ✅ Get active cart items
export const getCart = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;

    const [rows] = await db.query<RowDataPacket[]>(
      `SELECT c.id, c.menu_item_id, c.quantity, c.price, c.status, c.created_at, c.updated_at,
              m.name AS menu_item_name, m.image
       FROM cart c
       JOIN menuItems m ON c.menu_item_id = m.id
       WHERE c.user_id = ? AND c.status = 'active'`,
      [userId]
    );

    res.json(rows);
  } catch (error: any) {
    console.error("Error fetching cart:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ✅ Update cart item
export const updateCartItem = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { id } = req.params;
    const { quantity, status } = req.body;

    const [result] = await db.query<ResultSetHeader>(
      "UPDATE cart SET quantity = COALESCE(?, quantity), status = COALESCE(?, status) WHERE id = ? AND user_id = ?",
      [quantity, status, id, userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    res.json({ message: "Cart item updated successfully" });
  } catch (error: any) {
    console.error("Error updating cart:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ✅ Delete cart item
export const deleteCartItem = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { id } = req.params;

    const [result] = await db.query<ResultSetHeader>(
      "DELETE FROM cart WHERE id = ? AND user_id = ?",
      [id, userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    res.json({ message: "Cart item removed successfully" });
  } catch (error: any) {
    console.error("Error deleting cart item:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const checkout = async (req: Request, res: Response) => {
  const { user_id } = req.body;

  try {
    // 1. Get active cart items for user
    const [cartItems]: any = await db.query(
      "SELECT * FROM cart WHERE user_id = ? AND status = 'active'",
      [user_id]
    );

    if (cartItems.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // 2. Calculate total
    let total = 0;
    cartItems.forEach((item: any) => {
      total += item.price * item.quantity;
    });

    // 3. Create order
    const [orderResult]: any = await db.query(
      "INSERT INTO orders (user_id, order_status, total) VALUES (?, ?, ?)",
      [user_id, "pending", total]
    );

    const orderId = orderResult.insertId;

    // 4. Insert order_items
    for (const item of cartItems) {
      await db.query(
        "INSERT INTO order_items (order_id, menu_item_id, quantity, price) VALUES (?, ?, ?, ?)",
        [orderId, item.menu_item_id, item.quantity, item.price]
      );
    }

    // 5. Mark cart as checked_out
    await db.query(
      "UPDATE cart SET status = 'checked_out' WHERE user_id = ? AND status = 'active'",
      [user_id]
    );

    res.status(201).json({ message: "Order created successfully", orderId });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: "Error during checkout", error: err.message });
  }
};