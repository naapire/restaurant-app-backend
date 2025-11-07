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

/** Helper: remove password before sending user */
const sanitizeUser = (userRow: any) => {
  const { password, ...safe } = userRow;
  return safe;
};

/** ✅ SIGNUP CONTROLLER */
export const signUp = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, location, role, restaurantId } = req.body as {
      name: string;
      email: string;
      password: string;
      location?: string;
      role?: string;
      restaurantId?: number;
    };

    if (!name || !email || !password) {
      res.status(400).json({ message: "name, email and password are required" });
      return;
    }

    // Check if email already exists
    const [existing] = await db.query<RowDataPacket[]>(
      "SELECT id FROM users WHERE email = ?",
      [email]
    );
    if (existing.length > 0) {
      res.status(409).json({ message: "Email already registered" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const finalRole = role ?? "customer";

    const [insertResult] = await db.query<ResultSetHeader>(
      "INSERT INTO users (name, email, password, location, role, restaurantId) VALUES (?, ?, ?, ?, ?, ?)",
      [name, email, hashedPassword, location ?? null, finalRole, restaurantId ?? null]
    );

    const userId = insertResult.insertId;

    const token = jwt.sign(
      { id: userId, email, role: finalRole, restaurantId: restaurantId ?? null },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN } as jwt.SignOptions
    );

    res.status(201).json({
      message: "Signup successful",
      token,
      user: { id: userId, name, email, role: finalRole, restaurantId: restaurantId ?? null, location: location ?? null },
    });
  } catch (error: any) {
    console.error("signUp error:", error);
    res.status(500).json({ error: "Failed to sign up" });
  }
};

/** ✅ LOGIN CONTROLLER */
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

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    const token = jwt.sign(
      {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        restaurantId: user.restaurantId ?? null,
      },
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

/** ✅ UPDATE USER */
export const updateUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, email, role, restaurantId } = req.body as {
      name?: string;
      email?: string;
      role?: string;
      restaurantId?: number | null;
    };

    if (!name && !email && !role && restaurantId === undefined) {
      res.status(400).json({ message: "Nothing to update" });
      return;
    }

    // Check email uniqueness
    if (email) {
      const [existing] = await db.query<RowDataPacket[]>(
        "SELECT id FROM users WHERE email = ? AND id != ?",
        [email, id]
      );
      if (existing.length > 0) {
        res.status(409).json({ message: "Email already in use" });
        return;
      }
    }

    const [result] = await db.query<ResultSetHeader>(
      `UPDATE users 
       SET name = COALESCE(?, name), 
           email = COALESCE(?, email),
           role = COALESCE(?, role),
           restaurantId = COALESCE(?, restaurantId)
       WHERE id = ?`,
      [name ?? null, email ?? null, role ?? null, restaurantId ?? null, id]
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

/** ✅ DELETE USER */
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

/** ✅ GET ALL USERS */
export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const [rows] = await db.query<RowDataPacket[]>(
      "SELECT id, name, email, location, role, restaurantId, created_at FROM users"
    );
    res.status(200).json(rows);
  } catch (error: any) {
    console.error("getAllUsers error:", error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
};

/** ✅ ASSIGN MANAGER */
export const assignManager = async (req: Request, res: Response) => {
  try {
    const { email, restaurantId, role } = req.body as {
      email?: string;
      restaurantId?: number;
      role?: string;
    };

    if (!email || !restaurantId) {
      return res.status(400).json({ message: "Email and restaurantId are required." });
    }

    // Check if user exists
    const [userRows] = await db.query<RowDataPacket[]>("SELECT * FROM users WHERE email = ?", [email]);
    if (userRows.length === 0) {
      return res.status(404).json({ message: "User not found." });
    }

    const finalRole = role ?? "manager";

    // Update user role and restaurantId
    await db.query<ResultSetHeader>(
      "UPDATE users SET role = ?, restaurantId = ? WHERE email = ?",
      [finalRole, restaurantId, email]
    );

    return res.status(200).json({ message: `User has been assigned as ${finalRole} successfully.` });
  } catch (error: any) {
    console.error("assignManager error:", error);
    return res.status(500).json({ message: "Server error while assigning manager." });
  }
};
