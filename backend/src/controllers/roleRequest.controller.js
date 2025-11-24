import RoleRequest from "../models/roleRequest.model.js";
import User from "../models/user.model.js";

// User request role upgrade
export const requestRole = async (req, res) => {
  try {
    const { requestedRole, reason } = req.body;
    const userId = req.user._id;

    // Validasi requested role
    if (!["admin", "contributor"].includes(requestedRole)) {
      return res.status(400).json({ message: "Invalid role request" });
    }

    // Cek apakah user sudah punya role yang diminta
    const user = await User.findById(userId);
    if (user.role === requestedRole) {
      return res.status(400).json({ message: "You already have this role" });
    }

    // Cek apakah sudah ada pending request
    const existingRequest = await RoleRequest.findOne({
      userId,
      requestedRole,
      status: "pending",
    });
    if (existingRequest) {
      return res.status(400).json({ message: "You already have a pending request for this role" });
    }

    // Buat role request baru
    const roleRequest = new RoleRequest({
      userId,
      requestedRole,
      reason: reason || "",
      status: "pending",
    });

    await roleRequest.save();

    res.status(201).json({
      message: "Role request submitted successfully",
      roleRequest,
    });
  } catch (error) {
    console.log("Error in requestRole", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Admin get all pending role requests
export const getRoleRequests = async (req, res) => {
  try {
    const { status = "pending" } = req.query;

    const roleRequests = await RoleRequest.find({ status })
      .populate("userId", "fullName email role profilePic")
      .sort({ createdAt: -1 });

    res.status(200).json(roleRequests);
  } catch (error) {
    console.log("Error in getRoleRequests", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Admin approve role request
export const approveRoleRequest = async (req, res) => {
  try {
    const { requestId } = req.params;

    const roleRequest = await RoleRequest.findById(requestId);
    if (!roleRequest) {
      return res.status(404).json({ message: "Role request not found" });
    }

    if (roleRequest.status !== "pending") {
      return res.status(400).json({ message: "This request has already been processed" });
    }

    // Update user role
    await User.findByIdAndUpdate(roleRequest.userId, {
      role: roleRequest.requestedRole,
    });

    // Update request status
    roleRequest.status = "approved";
    roleRequest.updatedAt = Date.now();
    await roleRequest.save();

    res.status(200).json({
      message: "Role request approved successfully",
      roleRequest,
    });
  } catch (error) {
    console.log("Error in approveRoleRequest", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Admin reject role request
export const rejectRoleRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { rejectionReason } = req.body;

    const roleRequest = await RoleRequest.findById(requestId);
    if (!roleRequest) {
      return res.status(404).json({ message: "Role request not found" });
    }

    if (roleRequest.status !== "pending") {
      return res.status(400).json({ message: "This request has already been processed" });
    }

    // Update request status
    roleRequest.status = "rejected";
    roleRequest.rejectionReason = rejectionReason || "";
    roleRequest.updatedAt = Date.now();
    await roleRequest.save();

    res.status(200).json({
      message: "Role request rejected successfully",
      roleRequest,
    });
  } catch (error) {
    console.log("Error in rejectRoleRequest", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
