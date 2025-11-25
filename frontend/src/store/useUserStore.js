import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";

export const useUserStore = create((set) => ({
    userProfile: null,
    isFetchingProfile: false,
    isUpdatingProfile: false,

    getUserProfile: async(userId) => {
        set({ isFetchingProfile: true });
        try {
            const res = await axiosInstance.get(`/api/users/profile/${userId}`);
            set({ userProfile: res.data });
        } catch (error) {
            toast.error(error.response.data.message)
        } finally {
            set({ isFetchingProfile: false });
        }
    },

    updateProfile: async(data) => {
        set({ isUpdatingProfile: true });
        try {
            const res = await axiosInstance.put("/api/users/update-profile", data);
            set({ userProfile: {...data, ...res.data } });
            toast.success("Profile updated successfully");
        } catch (error) {
            toast.error(error.response.data.message)
        } finally {
            set({ isUpdatingProfile: false });
        }
    },


}))