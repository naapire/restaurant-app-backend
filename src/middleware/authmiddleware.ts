import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "secret";

export interface AuthUser {
  id: number;
  role: string;
  restaurantId?: number | null; // ensures managers have assigned restaurant
}

// ✅ Authentication middleware (checks for valid token)
export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  let token: string | undefined;

  // 1️⃣ Try Authorization header
  const authHeader = req.headers["authorization"];
  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  }

  // 2️⃣ Try cookies
  if (!token && (req as any).cookies?.token) {
    token = (req as any).cookies.token;
  }

  if (!token) {
    res.status(401).json({ message: "No token provided" });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AuthUser;
    (req as any).user = decoded; // attach user info (id, role, restaurantId)
    next();
  } catch (err) {
    res.status(403).json({ message: "Invalid or expired token" });
  }
};

// ✅ Admin-only middleware
export const isAdmin = (req: Request, res: Response, next: NextFunction): void => {
  const user = (req as any).user as AuthUser;

  if (!user || user.role !== "admin") {
    res.status(403).json({ message: "Access denied. Admins only." });
    return;
  }

  next();
};

// ✅ Manager-only middleware — ensures they can only access their own restaurant data
export const isManagerForRestaurant = (req: Request, res: Response, next: NextFunction): void => {
  const user = (req as any).user as AuthUser;

  if (!user) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  // Allow admins to bypass restrictions
  if (user.role === "admin") {
    return next();
  }

  // Deny if user isn’t a manager
  if (user.role !== "manager") {
    res.status(403).json({ message: "Access denied. Managers only." });
    return;
  }

  // Check restaurant ID from params/body/query
  const requestedRestaurantId =
    parseInt(req.params.id) || // ✅ e.g. /restaurants/:id
    parseInt(req.body.restaurantId) ||
    parseInt(req.query.restaurantId as string);

  if (!requestedRestaurantId) {
    res.status(400).json({ message: "Restaurant ID required in request" });
    return;
  }

  // Ensure manager only accesses their restaurant
  if (user.restaurantId !== requestedRestaurantId) {
    res.status(403).json({
      message: "Access denied. You can only access your assigned restaurant data.",
    });
    return;
  }

  next();
};
