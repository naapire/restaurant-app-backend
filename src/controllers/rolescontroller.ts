import type { Request, Response } from "express";
import db from "../config/db.ts";
import { randomUUID } from "crypto";

// ✅ Create Role with Permissions
export const createRole = async (req: Request, res: Response) => {
  const connection = await db.getConnection();
  await connection.beginTransaction();

  try {
    const { name, description, permissionUIds } = req.body; // permissionUIds = ["uuid1", "uuid2"]

    if (!name) return res.status(400).json({ message: "Role name is required" });

    const [existing] = await connection.execute("SELECT * FROM roles WHERE name = ?", [name]);
    if ((existing as any[]).length > 0) {
      return res.status(409).json({ message: "Role already exists" });
    }

    const roleUId = randomUUID();

    await connection.execute(
      "INSERT INTO roles (uId, name, description) VALUES (?, ?, ?)",
      [roleUId, name, description]
    );

    if (permissionUIds && permissionUIds.length > 0) {
      for (const permissionUId of permissionUIds) {
        await connection.execute(
          "INSERT INTO role_permissions (role_uId, permission_uId) VALUES (?, ?)",
          [roleUId, permissionUId]
        );
      }
    }

    await connection.commit();
    res.status(201).json({
      message: "Role created successfully",
      uId: roleUId,
      name,
      description,
      permissions: permissionUIds || [],
    });
  } catch (error) {
    await connection.rollback();
    console.error("Error creating role:", error);
    res.status(500).json({ message: "Internal server error" });
  } finally {
    connection.release();
  }
};

// ✅ Get All Roles with Assigned Permissions
export const getRoles = async (_req: Request, res: Response) => {
  try {
    const [roles] = await db.execute(`
      SELECT 
        r.uId, r.name, r.description,
        COUNT(rp.permission_uId) AS permission_count,
        GROUP_CONCAT(p.name) AS permissions
      FROM roles r
      LEFT JOIN role_permissions rp ON r.uId = rp.role_uId
      LEFT JOIN permissions p ON rp.permission_uId = p.uId
      GROUP BY r.uId
      ORDER BY r.name ASC
    `);

    res.status(200).json(roles);
  } catch (error) {
    console.error("Error fetching roles:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ✅ Get Single Role by ID with Permissions
export const getRoleById = async (req: Request, res: Response) => {
  try {
    const { uId } = req.params;

    const [roleRows] = await db.execute("SELECT * FROM roles WHERE uId = ?", [uId]);
    if ((roleRows as any[]).length === 0) {
      return res.status(404).json({ message: "Role not found" });
    }

    const [permissions] = await db.execute(
      `SELECT p.uId, p.name, p.description 
       FROM role_permissions rp 
       JOIN permissions p ON rp.permission_uId = p.uId 
       WHERE rp.role_uId = ?`,
      [uId]
    );

    const role = (roleRows as any[])[0];
    res.status(200).json({ ...role, permissions });
  } catch (error) {
    console.error("Error fetching role:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ✅ Update Role and its Permissions
export const updateRole = async (req: Request, res: Response) => {
  const connection = await db.getConnection();
  await connection.beginTransaction();

  try {
    const { uId } = req.params;
    const { name, description, permissionUIds } = req.body;

    const [existing] = await connection.execute("SELECT * FROM roles WHERE uId = ?", [uId]);
    if ((existing as any[]).length === 0)
      return res.status(404).json({ message: "Role not found" });

    await connection.execute(
      "UPDATE roles SET name = ?, description = ? WHERE uId = ?",
      [name, description, uId]
    );

    // Remove old permissions
    await connection.execute("DELETE FROM role_permissions WHERE role_uId = ?", [uId]);

    // Add new permissions
    if (permissionUIds && permissionUIds.length > 0) {
      for (const permissionUId of permissionUIds) {
        await connection.execute(
          "INSERT INTO role_permissions (role_uId, permission_uId) VALUES (?, ?)",
          [uId, permissionUId]
        );
      }
    }

    await connection.commit();
    res.status(200).json({ message: "Role updated successfully" });
  } catch (error) {
    await connection.rollback();
    console.error("Error updating role:", error);
    res.status(500).json({ message: "Internal server error" });
  } finally {
    connection.release();
  }
};

// ✅ Delete Role and its Permissions
export const deleteRole = async (req: Request, res: Response) => {
  try {
    const { uId } = req.params;

    const [existing] = await db.execute("SELECT * FROM roles WHERE uId = ?", [uId]);
    if ((existing as any[]).length === 0)
      return res.status(404).json({ message: "Role not found" });

    await db.execute("DELETE FROM role_permissions WHERE role_uId = ?", [uId]);
    await db.execute("DELETE FROM roles WHERE uId = ?", [uId]);

    res.status(200).json({ message: "Role deleted successfully" });
  } catch (error) {
    console.error("Error deleting role:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
