import type { Request, Response } from "express";
import db from "../config/db.ts";
import dotenv from "dotenv";

dotenv.config();

export const signUp = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, location, role } = req.body as {
      name: string;
      password: string;
      email: string;
      location: string;
      role: string;
    };

    if (!name || !email || !password) {
      res.status(400).json({ message: "All details must be provided" });
      return;
    }

    db.query(
      "INSERT INTO users(name, email, password, location, role) VALUES(?,?,?,?,?)",
      [name, email, password, location, role || "customer"],
      (err) => {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
        res.json({ message: "User signup successfully" });
      }
    );
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
