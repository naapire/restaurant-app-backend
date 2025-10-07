import cloudinary from "../cloudinary.ts";
import streamifier from "streamifier";

export const cloudinaryUpload = (
  fileBuffer?: Buffer,
  folder = "restaurant_uploads"
): Promise<string> => {
  return new Promise((resolve, reject) => {
    // ✅ Prevent undefined buffer errors
    if (!fileBuffer) {
      console.error("❌ cloudinaryUpload: fileBuffer is undefined");
      return reject(new Error("Invalid file: no buffer provided"));
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "image",
      },
      (error, result) => {
        if (error) {
          console.error("❌ Cloudinary upload failed:", error);
          return reject(error);
        }
        resolve(result?.secure_url || "");
      }
    );

    // ✅ Safe now — only runs when buffer is valid
    streamifier.createReadStream(fileBuffer).pipe(uploadStream);
  });
};
