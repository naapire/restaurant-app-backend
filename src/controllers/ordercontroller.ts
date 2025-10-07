import type { Request, Response } from "express";
import db from "../config/db.ts"; // make sure your db.ts exports the db

// Extend Request to include user (set in authMiddleware)
interface AuthRequest extends Request {
  user?: { id: number; role?: string };
}

// Create Order (customer checks out)
export const createOrder = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const userId = req.user.id;

    // 1. Get active cart items for this user
    const [cartItems]: any = await db.query(
      "SELECT * FROM cart WHERE user_id = ? AND status = 'active'",
      [userId]
    );

    if (cartItems.length === 0) {
      return res.status(400).json({ error: "Cart is empty" });
    }

    // 2. Calculate total from cart
    let total = 0;
    cartItems.forEach((item: any) => {
      total += item.quantity * parseFloat(item.price);
    });

    // 3. Create order
    const [orderResult]: any = await db.query(
      "INSERT INTO orders (user_id, order_status, total) VALUES (?, 'pending', ?)",
      [userId, total]
    );

    const orderId = orderResult.insertId;

    // 4. Insert each cart item into order_items
    for (const item of cartItems) {
      await db.query(
        "INSERT INTO order_items (order_id, menu_item_id, quantity, price) VALUES (?, ?, ?, ?)",
        [orderId, item.menu_item_id, item.quantity, item.price]
      );
    }

    // 5. Mark cart items as checked_out
    await db.query(
      "UPDATE cart SET status = 'checked_out' WHERE user_id = ? AND status = 'active'",
      [userId]
    );

    return res.status(201).json({
      message: "Order created successfully",
      orderId,
      userId,   // ✅ Added here
      total,
    });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get Orders (filtered by role)
export const getOrders = async (req: Request, res: Response) => {
  try {
    const { role, id: userId } = (req as any).user;

    let query = "SELECT * FROM orders";
    let params: any[] = [];

    if (role === "customer") {
      query += " WHERE user_id = ?";
      params.push(userId);
    } else if (role === "rider") {
      query += " WHERE rider_id = ?";
      params.push(userId);
    }
    // admin → sees all

    const [orders] = await db.query(query, params);
    res.json(orders);
  } catch (err: any) {
    console.error("getOrders error:", err.message);
    res.status(500).json({ error: err.message });
  }
};

// Get Order By ID
export const getOrderById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { role, id: userId } = (req as any).user;

    const [rows] = await db.query("SELECT * FROM orders WHERE id = ?", [id]);
    if ((rows as any).length === 0) {
      return res.status(404).json({ message: "Order not found" });
    }

    const order = (rows as any)[0];

    // Role-based restriction
    if (role === "customer" && order.user_id !== userId) {
      return res.status(403).json({ message: "Forbidden: not your order" });
    }
    if (role === "rider" && order.rider_id !== userId) {
      return res.status(403).json({ message: "Forbidden: not assigned to you" });
    }

    res.json(order);
  } catch (err: any) {
    console.error("getOrderById error:", err.message);
    res.status(500).json({ error: err.message });
  }
};

// Update Order Status
export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const { role } = (req as any).user;
    const { id } = req.params;
    const { order_status } = req.body;

    if (role !== "admin" && role !== "rider") {
      return res.status(403).json({ message: "Forbidden: only admin or rider can update status" });
    }

    await db.query("UPDATE orders SET order_status = ? WHERE id = ?", [
      order_status,
      id,
    ]);

    res.json({ message: "Order status updated" });
  } catch (err: any) {
    console.error("updateOrderStatus error:", err.message);
    res.status(500).json({ error: err.message });
  }
};

// Assign Rider (Admin only)
export const assignRider = async (req: Request, res: Response) => {
  try {
    const { role } = (req as any).user;
    const { id } = req.params;
    const { rider_id } = req.body;

    if (role !== "admin") {
      return res.status(403).json({ message: "Forbidden: only admin can assign riders" });
    }

    await db.query("UPDATE orders SET rider_id = ? WHERE id = ?", [
      rider_id,
      id,
    ]);

    res.json({ message: "Rider assigned successfully" });
  } catch (err: any) {
    console.error("assignRider error:", err.message);
    res.status(500).json({ error: err.message });
  }
};
