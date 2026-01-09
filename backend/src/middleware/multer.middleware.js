import multer from "multer";

// Use memoryStorage untuk Vercel serverless
const storage = multer.memoryStorage();

export const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});
