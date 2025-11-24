import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";

export const useAuthStore = create((set) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isCheckingAuth: true,
  isUpdatingPassword: false,

  checkAuth: async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        set({
          authUser: null,
          isCheckingAuth: false,
        });
        return;
      }

      const res = await axiosInstance.get("/auth/check");
      set({
        authUser: res.data.user,
        isCheckingAuth: false,
      });
    } catch (error) {
      console.log("Error in checkAuth", error);
      localStorage.removeItem("token");
      set({
        authUser: null,
        isCheckingAuth: false,
      });
    }
  },

  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      localStorage.setItem("token", res.data.token);
      set({ authUser: res.data.user });
      toast.success("Account created successfully");
    } catch (error) {
      const msg = error.response?.data?.message || "Gagal membuat akun. Silakan coba lagi.";
      toast.error(msg);
    } finally {
      set({
        isSigningUp: false,
      });
    }
  },

  login: async (data) => {
    set({
      isLoggingIn: true,
    });
    try {
      const res = await axiosInstance.post("/auth/login", data);

      if (!res.data.user) {
        throw new Error("Login failed: User data missing in response");
      }

      localStorage.setItem("token", res.data.token);
      set({ authUser: res.data.user });
      toast.success("Logged in successfully");

      return res.data; // return data for component use
    } catch (error) {
      const msg = error.response?.data?.message || "Email atau password salah.";
      toast.error(msg);
    } finally {
      set({
        isLoggingIn: false,
      });
    }
  },
  logout: () => {
    localStorage.removeItem("token");
    set({ authUser: null });
    toast.success("Logged out successfully");
  },

  changePassword: async (data) => {
    set({ isUpdatingPassword: true });
    try {
      await axiosInstance.put("/auth/change-password", data);
      toast.success("Password updated successfully");
    } catch (error) {
      const message = (error.response && error.response.data && error.response.data.message) || "Something went wrong";
      toast.error(message);
    } finally {
      set({ isUpdatingPassword: false });
    }
  },
}));
