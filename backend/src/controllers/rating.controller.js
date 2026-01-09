import cloudinary from "../lib/cloudinary.js";
import Rating from "../models/rating.model.js";
import fs from "fs";

export const getRatingsByPlace = async (req, res) => {
  try {
    const { placeId } = req.params;
    const ratings = await Rating.find({ place: placeId })
      .populate("user", "fullName profilePic")
      .sort({ createdAt: -1 });
    res.status(200).json(ratings);
  } catch (error) {
    console.log("Error in getRatingsByPlace controller", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const addRating = async (req, res) => {
  try {
    const { text, rate, place } = req.body;
    const user = req.user.id;

    if (!text || !rate || !user || !place) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingRating = await Rating.findOne({ user, place });

    if (existingRating) {
      return res.status(400).json({ message: "You have already reviewed this place" });
    }

    let imageUrls = [];

    if (req.files && req.files.length > 0) {
      const uploadPromises = req.files.map((file) =>
        cloudinary.uploader.upload(`data:${file.mimetype};base64,${file.buffer.toString("base64")}`, {
          folder: "mangan_rek_places_reviews",
        })
      );

      const uploadResults = await Promise.all(uploadPromises);
      imageUrls = uploadResults.map((result) => result.secure_url);
    }

    const newRating = new Rating({
      text,
      rate,
      image: imageUrls,
      user,
      place,
    });
    await newRating.save();

    res.status(201).json({
      _id: newRating._id,
      text: newRating.text,
      rate: newRating.rate,
      image: newRating.image,
      user: newRating.user,
      place: newRating.place,
    });
  } catch (error) {
    console.error("Error in addRating controller:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteRating = async (req, res) => {
  try {
    const { ratingId } = req.params;
    const rating = await Rating.findById(ratingId);
    if (!rating) {
      return res.status(404).json({ message: "Rating not found" });
    }
    await Rating.findByIdAndDelete(ratingId);

    // Manual update of place rating
    try {
      await Rating.updatePlaceRating(rating.place);
    } catch (err) {
      console.log("Warning: Could not update place rating after delete:", err.message);
      // Don't fail the request if rating update fails
    }

    res.status(200).json({ message: "Rating deleted successfully" });
  } catch (error) {
    console.log("Error in deleteRating controller", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
