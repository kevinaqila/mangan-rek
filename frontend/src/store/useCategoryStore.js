import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const useCategoryStore = create((set) => ({
    categories: [],
    selectedCategory: null,
    isLoadingCategories: false,

    getCategories: async() => {
        set({
            isLoadingCategories: true,
        })
        try {
            const res = await axiosInstance.get("/categories")
            set({ categories: res.data })
        } catch (error) {
            toast.error(error.response.data.mesage)
        } finally {
            set({ isLoadingCategories: false })
        }
    }
}))