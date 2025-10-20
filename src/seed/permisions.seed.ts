import type { RowDataPacket } from "mysql2";
import db from "../config/db.ts";
import { randomUUID } from "crypto";

const permissions = [
  { name: "view users", description: "Can view user list" },
  { name: "create user", description: "Can create a new user" },
  { name: "edit user", description: "Can edit user details" },
  { name: "delete user", description: "Can delete user" },
  { name: "view orders", description: "Can view all orders" },
  { name: "view restaurants", description: "Can view restaurant details" },
  { name: "create menu", description: "Can create a new menu" },
  { name: "add dishes", description: "Can add a new dish" },
  { name: "edit menu", description: "Can edit a menu" },
  { name: "delete menu", description: "Can delete menu" },
  { name: "update menu", description: "Can update amenu" },
  { name: "update dishes", description: "Can update dishes" },

];

export default async function seedPermissions() {
  try {
    for (const permission of permissions) {
      const [rows] = await db.execute("SELECT * FROM permissions WHERE name = ?", [permission.name]);

      if ((rows as RowDataPacket).length === 0){
        
        const uId = randomUUID();

        await db.execute(
          "INSERT INTO permissions (uId, name, description) VALUES (?, ?, ?)",
          [uId, permission.name, permission.description]
        );
        console.log(`✅ Permission added: ${permission.name}`);
      } else {
        console.log(`⚠️ Permission already exists: ${permission.name}`);
      }
    }

    console.log("✅ Seeding complete!");
  } catch (error) {
    console.error("❌ Seeding error:", error);
  }
}