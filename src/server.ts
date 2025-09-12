import mysql, { Connection } from "mysql2";
import dotenv from "dotenv";

dotenv.config();

const connection: Connection = mysql.createConnection({
  host: process.env.DB_HOST as string,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER as string,
  password: process.env.DB_PASSWORD as string,
  database: process.env.DB_NAME as string,
});

// Test connection
connection.connect((err) => {
  if (err) {
    console.error("❌ MySQL connection failed:", err.message);
    return;
  }
  console.log("✅ MySQL Connected");
});

export default connection;
