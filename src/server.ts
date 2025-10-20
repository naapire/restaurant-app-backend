import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import userRoutes from "./routes/userRoutes.ts";
import restaurantRoutes from "./routes/restaurantsRoutes.ts";
import menuRoutes from "./routes/menuRoutes.ts";
import { swaggerDocs } from "./config/swagger.ts";
import menuItemRoutes from "./routes/itemsRoutes.ts";
import riderRoutes from "./routes/riderRoutes.ts";
import cartRoutes from "./routes/cartRoutes.ts";
import orderRoutes from "./routes/orderRoutes.ts";
import adminRoutes from "./routes/adminRoutes.ts";
import rolesRoutes from "./routes/rolesRoutes.ts";
import helmet from "helmet"


dotenv.config();

const port = Number(process.env.SERVER_PORT) || 5000;
const app = express();

 

// ✅ Built-in middlewares
app.use(express.json()); // parse JSON bodies
app.use(express.urlencoded({ extended: true })); // parse form-urlencoded bodies
app.use(helmet());

// ✅ Enable CORS
app.use(
  cors({
    origin: "http://localhost:3000", // frontend URL
    credentials: true, // allow cookies/authorization headers
  })
);

// ✅ API Routes
app.use("/api", userRoutes);
app.use("/api", restaurantRoutes);
app.use("/api", menuRoutes);
app.use("/api", menuItemRoutes);
app.use("/api", riderRoutes);
app.use("/api", cartRoutes);
app.use("/api", orderRoutes);
app.use("/api", adminRoutes);
app.use("/api", rolesRoutes);

// ✅ Swagger documentation
swaggerDocs(app, port);

// ✅ Global error handler (optional, helpful for debugging)
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error("Global Error Handler:", err);
  res.status(err.status || 500).json({
    error: err.message || "Internal Server Error",
  });
});

app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
  console.log(`📘 Swagger docs available at http://localhost:${port}/api-docs`);
});
