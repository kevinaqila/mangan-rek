import express from "express";
import { getUserProfile, updateProfile } from "../controllers/user.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/multer.middleware.js";

const router = express.Router();

router.get("/profile/:userId", protectRoute, getUserProfile)

router.put("/update-profile", protectRoute, upload.single("profilePic"), updateProfile);

export default router;