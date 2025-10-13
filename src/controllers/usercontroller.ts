// src/controllers/usercontroller.ts
import type { Request, Response } from "express";
import db from "../config/db.ts";
import type { RowDataPacket, ResultSetHeader } from "mysql2";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET as jwt.Secret;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1d";

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET must be set in environment variables");
}

/**
 * Helper: remove sensitive fields from user object
 */
const sanitizeUser = (userRow: any) => {
  const { password, ...safe } = userRow;
  return safe;
};

/**
 * Sign up - create user, create rider record if role === 'rider', return JWT
 * NOTE: For production, DO NOT allow public creation of admin accounts.
 *       Either remove `role` from public signup or enforce server-side checks.
 */
export const signUp = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, location, role } = req.body as {
      name: string;
      email: string;
      password: string;
      location?: string;
      role?: string;
    };

    if (!name || !email || !password) {
      res.status(400).json({ message: "name, email and password are required" });
      return;
    }

    // Prevent duplicate email
    const [existing] = await db.query<RowDataPacket[]>("SELECT id FROM users WHERE email = ?", [email]);
    if (existing.length > 0) {
      res.status(409).json({ message: "Email already registered" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [insertResult] = await db.query<ResultSetHeader>(
      "INSERT INTO users (name, email, password, location, role) VALUES (?, ?, ?, ?, ?)",
      [name, email, hashedPassword, location ?? null, role ?? "customer"]
    );

    const userId = insertResult.insertId;

    // If role is rider, create riders entry (non-blocking; log errors)
    if ((role ?? "").toLowerCase() === "rider") {
      try {
        await db.query<ResultSetHeader>(
          "INSERT INTO riders (user_id, availability_status, rating) VALUES (?, 'offline', NULL)",
          [userId]
        );
      } catch (riderErr: any) {
        console.error("Failed to create rider row for user:", riderErr);
        // don't fail signup because of rider creation failure
      }
    }

    // Issue JWT (cast SignOptions so TS chooses the correct overload)
    const token = jwt.sign(
      { id: userId, email, role: role ?? "customer" },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN } as jwt.SignOptions
    );

    res.status(201).json({
      message: "Signup successful",
      token,
      user: { id: userId, name, email, role: role ?? "customer", location: location ?? null },
    });
  } catch (error: any) {
    console.error("signUp error:", error);
    res.status(500).json({ error: "Failed to sign up" });
  }
};

/**
 * Login - verify credentials, return JWT
 */
export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body as { email: string; password: string };
    if (!email || !password) {
      res.status(400).json({ message: "email and password are required" });
      return;
    }

    const [rows] = await db.query<RowDataPacket[]>("SELECT * FROM users WHERE email = ?", [email]);
    if (rows.length === 0) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    const user = rows[0] as any;
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    const token = jwt.sign(
      { id: user.id,name: user.name, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN } as jwt.SignOptions
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: sanitizeUser(user),
    });
  } catch (error: any) {
    console.error("loginUser error:", error);
    res.status(500).json({ error: "Failed to login" });
  }
};

/**
 * Update user - allow partial update of name and email (no password change here)
 */
export const updateUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, email } = req.body as { name?: string; email?: string };

    if (!name && !email) {
      res.status(400).json({ message: "Nothing to update" });
      return;
    }

    // If email changed, ensure uniqueness
    if (email) {
      const [existing] = await db.query<RowDataPacket[]>("SELECT id FROM users WHERE email = ? AND id != ?", [
        email,
        id,
      ]);
      if (existing.length > 0) {
        res.status(409).json({ message: "Email already in use" });
        return;
      }
    }

    const [result] = await db.query<ResultSetHeader>(
      "UPDATE users SET name = COALESCE(?, name), email = COALESCE(?, email) WHERE id = ?",
      [name ?? null, email ?? null, id]
    );

    if (result.affectedRows === 0) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.status(200).json({ message: "User updated successfully" });
  } catch (error: any) {
    console.error("updateUser error:", error);
    res.status(500).json({ error: "Failed to update user" });
  }
};

/**
 * Delete user
 */
export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const [result] = await db.query<ResultSetHeader>("DELETE FROM users WHERE id = ?", [id]);
    if (result.affectedRows === 0) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error: any) {
    console.error("deleteUser error:", error);
    res.status(500).json({ error: "Failed to delete user" });
  }
};

/**
 * Get all users (safe fields)
 */
export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const [rows] = await db.query<RowDataPacket[]>("SELECT id, name, email, location, role, created_at FROM users");
    res.status(200).json(rows);
  } catch (error: any) {
    console.error("getAllUsers error:", error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
};
