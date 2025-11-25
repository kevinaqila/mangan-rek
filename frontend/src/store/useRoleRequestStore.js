import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";

export const useRoleRequestStore = create((set) => ({
  roleRequests: [],
  isLoading: false,
  isSubmitting: false,

  submitRoleRequest: async (requestedRole, reason = "") => {
    set({ isSubmitting: true });
    try {
      const res = await axiosInstance.post("/api/role-requests/request", {
        requestedRole,
        reason,
      });
      toast.success(res.data.message);
      return res.data;
    } catch (error) {
      const msg = error.response?.data?.message || "Failed to submit role request";
      toast.error(msg);
      throw error;
    } finally {
      set({ isSubmitting: false });
    }
  },

  fetchRoleRequests: async (status = "pending") => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.get(`/api/role-requests/all?status=${status}`);
      set({ roleRequests: res.data });
    } catch (error) {
      const msg = error.response?.data?.message || "Failed to fetch role requests";
      toast.error(msg);
      set({ roleRequests: [] });
    } finally {
      set({ isLoading: false });
    }
  },

  approveRoleRequest: async (requestId) => {
    try {
      const res = await axiosInstance.put(`/api/role-requests/${requestId}/approve`);
      toast.success("Role request approved");
      set((state) => ({
        roleRequests: state.roleRequests.filter((req) => req._id !== requestId),
      }));
      return res.data;
    } catch (error) {
      const msg = error.response?.data?.message || "Failed to approve request";
      toast.error(msg);
      throw error;
    }
  },

  rejectRoleRequest: async (requestId, rejectionReason = "") => {
    try {
      const res = await axiosInstance.put(`/api/role-requests/${requestId}/reject`, {
        rejectionReason,
      });
      toast.success("Role request rejected");
      set((state) => ({
        roleRequests: state.roleRequests.filter((req) => req._id !== requestId),
      }));
      return res.data;
    } catch (error) {
      const msg = error.response?.data?.message || "Failed to reject request";
      toast.error(msg);
      throw error;
    }
  },
}));
