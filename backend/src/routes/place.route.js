import express from 'express';
import { addPlace, deletePlace, getAllPlaces, getPlaceById, updatePlace } from '../controllers/place.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post("/add-place", protectRoute, addPlace)

router.get("/explore", getAllPlaces)

router.get("/:id", getPlaceById)

router.put("update-place/:id", updatePlace)

router.delete("/delete-place/:id", deletePlace)

export default router