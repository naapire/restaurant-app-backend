import type { Request, Response } from "express";
import db from "../config/db.ts";
import bcrypt from "bcrypt";
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
    const hashedPassword = await bcrypt.hash(password, 10);

    db.query(
      "INSERT INTO users(name, email, password, location, role) VALUES(?,?,?,?,?)",
      [name, email, hashedPassword, location, role || "customer"],
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


export const loginUser = (req: Request, res: Response): void => {
  try {
    const { email, password } = req.body as {
      email: string;
      password: string;
    };

    db.query(
      "SELECT * FROM users WHERE email=?",
      [email],
      async (err, results: any[]) => {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }

        if (results.length === 0) {
          res.status(400).json({ message: "User not found" });
          return;
        }

        const user = results[0];
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
          res.status(401).json({ message: "Invalid credentials" });
          return;
        }

        res.status(200).json({ message: "Login successful" });
      }
    );
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};


export const updateUser = (req: Request, res: Response) : void =>{
  const {id} = req.params;
  const {name, email} = req.body as {
    name: string,
    email:string
};
 db.query(
    "UPDATE users SET name = ?, email = ? WHERE id = ?",
    [name, email, id],
    (err) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ message: "User updated successfully" });
    }
  );
} 