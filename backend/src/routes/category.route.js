import express from 'express';
import { addCategory, getCategories, updateCategory } from '../controllers/category.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';
import { checkRole } from '../middleware/role.middleware.js';

const router = express.Router();

router.post("/", protectRoute, checkRole("admin", "contributor"), addCategory)

router.get("/", getCategories)

router.put("/:id", protectRoute, checkRole("admin", "contributor"), updateCategory)

export default router