import express from "express";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes.ts";
import restaurantRoutes from "./routes/restaurantsRoutes.ts";
import menuRoutes from "./routes/menuRoutes.ts";
import { swaggerDocs } from "./config/swagger.ts";

dotenv.config();

const port = Number(process.env.SERVER_PORT) || 5000;
const app = express();

// Middleware
app.use(express.json());

// Routes
app.use("/api/users", userRoutes);
app.use("/api/restaurants", restaurantRoutes);
app.use("/api/menus", menuRoutes);

// Swagger documentation
swaggerDocs(app, port);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
  console.log(`Swagger docs available at http://localhost:${port}/api-docs`);
});
