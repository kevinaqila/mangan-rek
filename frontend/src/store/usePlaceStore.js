import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const usePlaceStore = create((set, get) => ({
    places: [],
    trendingPlaces: [],
    newestPlaces: [],
    myContributions: [],
    bookmarks: [],
    selectedPlace: null,
    totalBookmarks: 0,
    isAddingPlace: false,
    isLoadingPlaces: false,
    isLoadingSelectedPlace: false,
    isLoadingTrendingPlaces: false,
    isLoadingNewestPlaces: false,
    isLoadingContributions: false,
    isLoadingBookmarks: false,
    loadingBookmarkIds: new Set(), // Per-item loading for bookmarks

    getAllPlaces: async(filters = {}) => {
        set({ isLoadingPlaces: true });
        try {
            const queryParams = new URLSearchParams()

            // Category Logic
            if (filters.categories && filters.categories.length > 0) {
                queryParams.append('categories', filters.categories.join(','))
            }

            // Price Logic
            if (filters.price) {
                queryParams.append("price", filters.price)
            }

            // Rating Logic
            if (filters.rating) {
                queryParams.append("rating", filters.rating)
            }

            // Search Logic
            if (filters.search) {
                queryParams.append("search", filters.search)
            }

            const finalUrl = `/places/explore?${queryParams.toString()}`;
            console.log("🚀 Mengirim request API ke:", finalUrl); // Tetap bagus untuk debugging

            const res = await axiosInstance.get(finalUrl)
            set({ places: res.data })
        } catch (error) {
            const message = (error.response && error.response.data && error.response.data.message) || "Something went wrong";
            toast.error(message)
        } finally {
            set({ isLoadingPlaces: false })
        }
    },

    getTrendingPlaces: async() => {
        set({ isLoadingTrendingPlaces: true });
        try {
            const res = await axiosInstance.get("/places/trending")
            set({ trendingPlaces: res.data })
        } catch (error) {
            const message = (error.response && error.response.data && error.response.data.message) || "Something went wrong";
            toast.error(message)
        } finally {
            set({ isLoadingTrendingPlaces: false })
        }
    },

    getNewestPlaces: async() => {
        set({ isLoadingNewestPlaces: true });
        try {
            const res = await axiosInstance.get("/places/newest")
            set({ newestPlaces: res.data })
        } catch (error) {
            const message = (error.response && error.response.data && error.response.data.message) || "Something went wrong";
            toast.error(message)
        } finally {
            set({ isLoadingNewestPlaces: false })
        }
    },

    getPlaceBySlug: async(slug) => {
        set({ isLoadingSelectedPlace: true });
        try {
            const res = await axiosInstance.get(`/places/${slug}`)
            set({ selectedPlace: res.data })
        } catch (error) {
            const message = (error.response && error.response.data && error.response.data.message) || "Something went wrong";
            toast.error(message)
        } finally {
            set({ isLoadingSelectedPlace: false })
        }

    },

    addPlace: async(placeData) => {
        set({ isAddingPlace: true });
        try {
            await axiosInstance.post("/places", placeData)
        } catch (error) {
            const message = (error.response && error.response.data && error.response.data.message) || "Something went wrong";
            toast.error(message)
            throw error
        } finally {
            set({ isAddingPlace: false })
        }
    },

    getMyContributions: async() => {
        set({ isLoadingContributions: true })
        try {
            const res = await axiosInstance.get("/places/my-contributions")
            set({ myContributions: res.data })
        } catch (error) {
            const message = (error.response && error.response.data && error.response.data.message) || "Something went wrong";
            toast.error(message)
        } finally {
            set({ isLoadingContributions: false })
        }
    },

    getMyBookmarks: async(limit = 10, skip = 0, append = false) => {
        set({ isLoadingBookmarks: true })
        try {
            const res = await axiosInstance.get(`/places/my-bookmarks?limit=${limit}&skip=${skip}`)
            if (append) {
                // Append to existing bookmarks for infinite scroll
                set((state) => ({ bookmarks: [...state.bookmarks, ...res.data.bookmarks] }))
            } else {
                set({ bookmarks: res.data.bookmarks })
            }
            // Store total for pagination
            set({ totalBookmarks: res.data.total })
        } catch (error) {
            const message = (error.response && error.response.data && error.response.data.message) || "Something went wrong";
            toast.error(message)
        } finally {
            set({ isLoadingBookmarks: false })
        }
    },

    addBookmark: async(placeId, placeData = null) => {
        // Optimistic update: add to bookmarks immediately if placeData provided
        if (placeData) {
            set((state) => ({ bookmarks: [...state.bookmarks, placeData] }));
        }

        set((state) => ({ loadingBookmarkIds: new Set([...state.loadingBookmarkIds, placeId]) }));
        try {
            const res = await axiosInstance.post(`/places/my-bookmarks/${placeId}`)
            // Update with server response if available
            if (res.data && res.data.bookmarkedPlaces) {
                set({ bookmarks: res.data.bookmarkedPlaces })
            }
            toast.success(res.data?.message || "Place bookmarked");
            return res.data
        } catch (error) {
            // Rollback: remove from bookmarks if was added optimistically
            if (placeData) {
                set((state) => ({ bookmarks: state.bookmarks.filter(b => (b._id || b.id) !== placeId) }));
            }
            const message = (error.response && error.response.data && error.response.data.message) || "Something went wrong";
            toast.error(message);
            throw error
        } finally {
            set((state) => ({ loadingBookmarkIds: new Set([...state.loadingBookmarkIds].filter(id => id !== placeId)) }))
        }
    },

    removeBookmark: async(placeId) => {
        // Optimistic update: remove from bookmarks immediately
        const currentBookmarks = get().bookmarks;
        const placeToRemove = currentBookmarks.find(b => (b._id || b.id) === placeId);
        if (placeToRemove) {
            set({ bookmarks: currentBookmarks.filter(b => (b._id || b.id) !== placeId) });
        }

        set((state) => ({ loadingBookmarkIds: new Set([...state.loadingBookmarkIds, placeId]) }));
        try {
            const res = await axiosInstance.delete(`/places/my-bookmarks/${placeId}`)
            // Success - keep the optimistic update
            toast.success(res.data?.message || "Place removed from bookmarks");
            return res.data
        } catch (error) {
            // Rollback: add back to bookmarks
            if (placeToRemove) {
                set((state) => ({ bookmarks: [...state.bookmarks, placeToRemove] }));
            }
            const message = (error.response && error.response.data && error.response.data.message) || "Something went wrong";
            toast.error(message);
            throw error
        } finally {
            set((state) => ({ loadingBookmarkIds: new Set([...state.loadingBookmarkIds].filter(id => id !== placeId)) }))
        }
    }
}))