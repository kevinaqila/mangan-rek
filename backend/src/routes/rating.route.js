import express from "express"
import { addRating, deleteRating, getRatingsByPlace } from "../controllers/rating.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/multer.middleware.js";
import { checkRole } from "../middleware/role.middleware.js";

const router = express.Router();

router.get("/:placeId", getRatingsByPlace)

router.post("/:placeid", protectRoute, upload.array("images", 4), addRating)

router.delete("/:reviewId", protectRoute, checkRole("admin"), deleteRating)

export default router;