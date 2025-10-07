// src/controllers/riderController.ts
import type { Request, Response } from "express";
import db from "../config/db.ts";
import type { RowDataPacket, ResultSetHeader } from "mysql2";




/**
 * Create a new rider (admin only)
 */
export const createRider = async (req: Request, res: Response): Promise<void> => {
  try {
    const { user_id } = req.body;

    if (!user_id) {
      res.status(400).json({ message: "user_id is required" });
      return;
    }

    // Check if user exists
    const [user]: any = await db.query<RowDataPacket[]>(
      "SELECT id, role FROM users WHERE id = ?",
      [user_id]
    );

    if (user.length === 0) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    // Optionally: force role to "rider"
    if (user[0].role !== "rider") {
      await db.query("UPDATE users SET role = 'rider' WHERE id = ?", [user_id]);
    }

    // Insert into riders table
    const [result] = await db.query<ResultSetHeader>(
      "INSERT INTO riders (user_id, availability_status) VALUES (?, 'offline')",
      [user_id]
    );

    res.status(201).json({
      message: "Rider created successfully",
      riderId: (result as ResultSetHeader).insertId,
      user_id,
    });
  } catch (error: any) {
    console.error("createRider error:", error);
    res.status(500).json({ error: "Failed to create rider" });
  }
};

/**
 * Assign a rider to an order (admin only)
 */
export const assignRiderToOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    const { order_id, rider_id } = req.body;

    if (!order_id || !rider_id) {
      res.status(400).json({ message: "order_id and rider_id are required" });
      return;
    }

    // Check rider availability
    const [rider]: any = await db.query<RowDataPacket[]>(
      "SELECT * FROM riders WHERE id = ?",
      [rider_id]
    );

    if (rider.length === 0) {
      res.status(404).json({ message: "Rider not found" });
      return;
    }

    if (rider[0].availability_status !== "available") {
      res.status(400).json({ message: "Rider is not available" });
      return;
    }

    // Assign rider to order
    const [result] = await db.query<ResultSetHeader>(
      "UPDATE orders SET rider_id = ?, order_status = 'assigned' WHERE id = ?",
      [rider_id, order_id]
    );

    if ((result as ResultSetHeader).affectedRows === 0) {
      res.status(404).json({ message: "Order not found" });
      return;
    }

    // Mark rider as busy
    await db.query("UPDATE riders SET availability_status = 'busy' WHERE id = ?", [rider_id]);

    res.status(200).json({
      message: "Rider assigned successfully",
      order_id,
      rider_id,
    });
  } catch (error: any) {
    console.error("assignRiderToOrder error:", error);
    res.status(500).json({ error: "Failed to assign rider" });
  }
};

/**
 * Mark order as delivered and free the rider
 */
export const completeOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    const { order_id } = req.body;

    const [order]: any = await db.query<RowDataPacket[]>(
      "SELECT rider_id FROM orders WHERE id = ?",
      [order_id]
    );

    if (order.length === 0) {
      res.status(404).json({ message: "Order not found" });
      return;
    }

    const riderId = order[0].rider_id;

    // Mark order delivered
    await db.query("UPDATE orders SET order_status = 'delivered' WHERE id = ?", [order_id]);

    // Free the rider
    if (riderId) {
      await db.query("UPDATE riders SET availability_status = 'available' WHERE id = ?", [
        riderId,
      ]);
    }

    res.status(200).json({ message: "Order completed and rider is now available" });
  } catch (error: any) {
    console.error("completeOrder error:", error);
    res.status(500).json({ error: "Failed to complete order" });
  }
};



/**
 * Get all riders
 */
export const getAllRiders = async (req: Request, res: Response): Promise<void> => {
  try {
    const [rows] = await db.query<RowDataPacket[]>("SELECT * FROM riders");
    res.status(200).json(rows);
  } catch (error: any) {
    console.error("getAllRiders error:", error);
    res.status(500).json({ error: "Failed to fetch riders" });
  }
};

/**
 * Get a single rider by id
 */
export const getRiderById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const [rows] = await db.query<RowDataPacket[]>("SELECT * FROM riders WHERE id = ?", [id]);

    if (rows.length === 0) {
      res.status(404).json({ message: "Rider not found" });
      return;
    }

    res.status(200).json(rows[0]);
  } catch (error: any) {
    console.error("getRiderById error:", error);
    res.status(500).json({ error: "Failed to fetch rider" });
  }
};

/**
 * Update rider availability status
 */
export const updateRiderStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { availability_status } = req.body as { availability_status: string };

    if (!["available", "busy", "offline"].includes(availability_status)) {
      res.status(400).json({
        message: "Invalid status. Use 'available', 'busy', or 'offline'.",
      });
      return;
    }

    const [result] = await db.query<ResultSetHeader>(
      "UPDATE riders SET availability_status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
      [availability_status, id]
    );

    if (result.affectedRows === 0) {
      res.status(404).json({ message: "Rider not found" });
      return;
    }

    res.status(200).json({ message: "Rider status updated successfully" });
  } catch (error: any) {
    console.error("updateRiderStatus error:", error);
    res.status(500).json({ error: "Failed to update rider status" });
  }
};

/**
 * Delete a rider
 */
export const deleteRider = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const [result] = await db.query<ResultSetHeader>("DELETE FROM riders WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
      res.status(404).json({ message: "Rider not found" });
      return;
    }

    res.status(200).json({ message: "Rider deleted successfully" });
  } catch (error: any) {
    console.error("deleteRider error:", error);
    res.status(500).json({ error: "Failed to delete rider" });
  }
};
