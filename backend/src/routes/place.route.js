import express from 'express';
import { addBookmark, addPlace, deletePlace, getAllPlaces, getMyBookmarks, getMyContributions, getNewestPlaces, getPlaceBySlug, getTrendingPlaces, removeBookmark, updatePlace } from '../controllers/place.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';
import { upload } from '../middleware/multer.middleware.js';
import { checkRole } from '../middleware/role.middleware.js';

const router = express.Router();

router.post("/", protectRoute, checkRole("admin", "contributor"), upload.fields([{ name: 'mainImage', maxCount: 1 }, { name: 'galleryImages', maxCount: 6 }]), addPlace)

router.get("/explore", getAllPlaces)

router.get("/trending", getTrendingPlaces)

router.get("/newest", getNewestPlaces)

router.get("/my-contributions", protectRoute, checkRole("admin", "contributor"), getMyContributions)

router.get("/my-bookmarks", protectRoute, getMyBookmarks)

router.post("/my-bookmarks/:placeId", protectRoute, addBookmark)

router.delete("/my-bookmarks/:placeId", protectRoute, removeBookmark)

router.put("/:id", protectRoute, checkRole("admin", "contributor"), upload.fields([
    { name: 'mainImage', maxCount: 1 },
    { name: 'galleryImages', maxCount: 5 }
]), updatePlace)

router.delete("/:id", protectRoute, checkRole("admin", "contributor"), deletePlace)

router.get("/:slug", getPlaceBySlug)

export default router;