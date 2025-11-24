import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { checkRole } from "../middleware/role.middleware.js";
import {
  requestRole,
  getRoleRequests,
  approveRoleRequest,
  rejectRoleRequest,
} from "../controllers/roleRequest.controller.js";

const router = express.Router();

// User request role (protected, any authenticated user)
router.post("/request", protectRoute, requestRole);

// Admin get all role requests with optional status filter
router.get("/all", protectRoute, checkRole("admin"), getRoleRequests);

// Admin approve role request
router.put("/:requestId/approve", protectRoute, checkRole("admin"), approveRoleRequest);

// Admin reject role request
router.put("/:requestId/reject", protectRoute, checkRole("admin"), rejectRoleRequest);

export default router;
