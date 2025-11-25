import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const useRatingStore = create((set, get) => ({
    ratings: [],
    setRatings: (ratings) => set({ ratings }),
    isLoadingRatings: false,
    isAddingRating: false,
    selectedPlace: null,

    getRatingPlace: async(placeId) => {
        set({ isLoadingRatings: true });
        try {
            const res = await axiosInstance.get(`/api/ratings/${placeId}`);
            set({ ratings: res.data });
        } catch (error) {
            toast.error(error.response.data.message)
        } finally {
            set({ isLoadingRatings: false })
        }
    },

    addRating: async(data) => {
        set({ isAddingRating: true })
        const { ratings } = get()
        try {
            const ratingData = new FormData()
            ratingData.append("text", data.text)
            ratingData.append("rate", data.rate)
            ratingData.append("place", data.place)
            if (data.images) {
                data.images.forEach((image) => {
                    ratingData.append("images", image)
                })
            }

            const res = await axiosInstance.post(`/api/ratings/${data.place}`, ratingData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            })
            set({ ratings: [res.data, ...ratings] })
            toast.success("Review added successfully")
        } catch (error) {
            toast.error(error.response.data.message) || toast.error("Failed to add review")
        } finally {
            set({ isAddingRating: false })
        }
    }
}))