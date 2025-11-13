import dotenv from "dotenv";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import type { UploadApiResponse } from "cloudinary";
import fs from "fs";

dotenv.config();

// 🔹 Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME as string,
  api_key: process.env.CLOUDINARY_API_KEY as string,
  api_secret: process.env.CLOUDINARY_API_SECRET as string,
});

// 🔹 Use multer's local storage (temporary)
const upload = multer({ dest: "uploads/" });

// 🔹 Utility: upload to Cloudinary manually
export const uploadToCloudinary = async (
  localPath: string
): Promise<string> => {
  try {
    const result: UploadApiResponse = await cloudinary.uploader.upload(
      localPath,
      {
        folder: "posts",
        transformation: [{ width: 1000, crop: "limit", quality: "auto" }],
      }
    );

    // Remove local temp file after upload
    fs.unlinkSync(localPath);
    return result.secure_url;
  } catch (error) {
    // Ensure cleanup on failure
    if (fs.existsSync(localPath)) fs.unlinkSync(localPath);
    throw error;
  }
};

export { upload };
