import type{ Request, Response } from "express";
import db from "../config/db.ts";
import type { RowDataPacket } from "mysql2";

/**
 * ✅ Get Admin Dashboard Stats
 * - Counts total users, restaurants, and orders
 * - Calculates total revenue (sum of totalAmount in orders)
 */
export const getAdminStats = async (req: Request, res: Response): Promise<void> => {
  try {
    // Query total users
    const [userRows] = await db.query<RowDataPacket[]>("SELECT COUNT(*) AS total_users FROM users");

    // Query total restaurants
    const [restaurantRows] = await db.query<RowDataPacket[]>("SELECT COUNT(*) AS total_restaurants FROM restaurants");

    // Query total orders
    const [orderRows] = await db.query<RowDataPacket[]>("SELECT COUNT(*) AS total_orders FROM orders");

    // Query total revenue (sum of totalAmount column)
    //const [revenueRows] = await db.query<RowDataPacket[]>("SELECT IFNULL(SUM(totalAmount), 0) AS total_revenue FROM orders");

    // Extract numbers
    const total_users = userRows[0]?.total_users || 0;
    const total_restaurants = restaurantRows[0]?.total_restaurants || 0;
    const total_orders = orderRows[0]?.total_orders || 0;
    //const total_revenue = revenueRows[0]?.total_revenue || 0;

    res.status(200).json({
      total_users,
      total_restaurants,
      total_orders,
      //total_revenue,
    });
  } catch (error: any) {
    console.error("Error fetching admin stats:", error);
    res.status(500).json({ message: "Failed to fetch admin stats" });
  }
};


export const getAllPermissions = async (_req: Request, res: Response) => {
  try {
    const [permissions] = await db.execute("SELECT * FROM permissions ORDER BY name ASC");
    res.status(200).json(permissions);
  } catch (error) {
    console.error("Error fetching permissions:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};