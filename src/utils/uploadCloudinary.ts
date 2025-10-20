import cloudinary from "../cloudinary.ts";
import streamifier from "streamifier";

export const cloudinaryUpload = (
  fileBuffer?: Buffer,
  folder = "restaurant_uploads"
): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (!fileBuffer) {
      console.error("❌ cloudinaryUpload: fileBuffer is undefined");
      return reject(new Error("Invalid file: no buffer provided"));
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      { folder, resource_type: "image" },
      (error, result) => {
        if (error) {
          console.error("❌ Cloudinary upload failed:", error);
          return reject(error);
        }

        if (!result?.secure_url) {
          console.error("❌ No secure_url returned from Cloudinary");
          return reject(new Error("No image URL returned from Cloudinary"));
        }

        console.log("✅ Cloudinary uploaded image URL:", result.secure_url);
        resolve(result.secure_url);
      }
    );

    streamifier.createReadStream(fileBuffer).pipe(uploadStream);
  });
};
