import multer from "multer";
import cloudinary from "../../cloudinary.ts";
import fs from "fs";
import type { Request, Response, NextFunction } from "express";

// ✅ Configure multer to store files temporarily
const upload = multer({ dest: "uploads/" });

// ✅ Middleware to upload file to Cloudinary
export const uploadToCloudinary = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // ✅ If no file uploaded, continue (for updates without new image)
    if (!req.file) {
      (req as any).cloudinaryUrl = null;
      return next();
    }

    // ✅ Upload the file to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "restaurant_uploads",
    });

    // ✅ Remove temporary file from uploads/
    fs.unlinkSync(req.file.path);

    // ✅ Attach Cloudinary URL to req
    (req as any).cloudinaryUrl = result.secure_url;

    next();
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    return res.status(500).json({ message: "Cloudinary upload failed", error });
  }
};

// ✅ Export both multer and upload middleware
export default upload;
