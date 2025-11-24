import fs from "fs"
import cloudinary from "../lib/cloudinary.js";

import User from "../models/user.model.js";
import Rating from "../models/rating.model.js";
import Place from "../models/place.model.js";

export const getUserProfile = async(req, res) => {
    try {
        const { userId } = req.params;
        console.log(`Backend menerima permintaan untuk user ID: ${userId}`);

        const user = await User.findById(userId).select("-password -__v -createdAt -updatedAt");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const userRatings = await Rating.find({ user: userId })
            .sort({ createdAt: -1 })
            .populate("place");

        const placesAddedCount = await Place.countDocuments({ createdBy: userId });

        res.status(200).json({
            user: user,
            totalReviews: userRatings.length,
            totalPlacesAdded: placesAddedCount,
            activities: userRatings
        });

    } catch (error) {
        console.log("Error in getUserProfile controller", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const updateProfile = async(req, res) => {
    try {
        const { fullName, bio } = req.body;
        const userId = req.user._id;
        let profilePicUrl;

        if (req.file) {
            const uploadResponse = await cloudinary.uploader.upload(req.file.path, {
                folder: "mangan_rek_profiles",
                resource_type: "image",
            });
            profilePicUrl = uploadResponse.secure_url;

            fs.unlinkSync(req.file.path);
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.fullName = fullName || user.fullName;
        user.bio = bio || user.bio;
        user.profilePic = profilePicUrl || user.profilePic;

        const updatedUser = await user.save();

        res.status(200).json({
            _id: updatedUser._id,
            fullName: updatedUser.fullName,
            email: updatedUser.email,
            profilePic: updatedUser.profilePic,
            bio: updatedUser.bio,
        });
    } catch (error) {
        console.log("Error in updateProfile controller", error.message);

        if (req.file) {
            fs.unlinkSync(req.file.path);
        }
        res.status(500).json({ message: "Internal server error" });
    }
};

export const submitRole = async (req, res) => { 
    try {
        
    } catch (error) {
        
    }
}