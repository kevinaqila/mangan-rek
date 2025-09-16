import fs from "fs"
import cloudinary from "../lib/cloudinary.js";

import User from "../models/user.model.js";

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