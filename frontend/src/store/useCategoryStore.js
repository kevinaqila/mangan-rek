import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const useCategoryStore = create((set) => ({
  categories: [],
  selectedCategory: null,
  isLoadingCategories: false,

  getCategories: async () => {
    set({
      isLoadingCategories: true,
    });
    try {
      const res = await axiosInstance.get("/api/categories");
      set({ categories: res.data });
    } catch (error) {
      const message = error.response?.data?.message || "Failed to load categories";
      toast.error(message);
    } finally {
      set({ isLoadingCategories: false });
    }
  },
}));
