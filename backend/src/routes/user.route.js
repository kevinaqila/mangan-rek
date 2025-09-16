import express from "express";
import { updateProfile } from "../controllers/user.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/multer.middleware.js";

const router = express.Router();

router.put("/update-profile", protectRoute, upload.single("profilePic"), updateProfile);

export default router;