import type{ Request, Response } from "express";
import db from "../config/db.ts";

export const getAllRiders = (req: Request, res: Response): void => {
  db.query("SELECT * FROM riders", (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.status(200).json(results);
  });
};


export const getRiderById = (req: Request, res: Response): void => {
  const { id } = req.params;

  db.query("SELECT * FROM riders WHERE id = ?", [id], (err, results:any) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if ((results as any).length === 0) {
      res.status(404).json({ message: "Rider not found" });
      return;
    }
    res.status(200).json(results[0]);
  });
};


export const updateRiderStatus = (req: Request, res: Response): void => {
  const { id } = req.params;
  const { availability_status } = req.body;

  if (!["available", "busy", "offline"].includes(availability_status)) {
    res.status(400).json({
      message: "Invalid status. Use 'available', 'busy', or 'offline'.",
    });
    return;
  }

  db.query(
    "UPDATE riders SET availability_status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
    [availability_status, id],
    (err, result) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      if ((result as any).affectedRows === 0) {
        res.status(404).json({ message: "Rider not found" });
        return;
      }
      res.status(200).json({ message: "Rider status updated successfully" });
    }
  );
};


export const deleteRider = (req: Request, res: Response): void => {
  const { id } = req.params;

  db.query("DELETE FROM riders WHERE id = ?", [id], (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if ((result as any).affectedRows === 0) {
      res.status(404).json({ message: "Rider not found" });
      return;
    }
    res.status(200).json({ message: "Rider deleted successfully" });
  });
};
