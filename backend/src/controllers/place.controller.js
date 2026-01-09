import Place from "../models/place.model.js";
import Rating from "../models/rating.model.js";

import cloudinary from "../lib/cloudinary.js";
import fs from "fs";
import User from "../models/user.model.js";
import mongoose from "mongoose";

export const addPlace = async (req, res) => {
  const tempFilePaths = [];

  try {
    const { name, description, address, location, openHours, category, priceRange } = req.body;
    const createdBy = req.user.id;

    const files = req.files;

    if (!name || !description || !address || !priceRange || !location || !files.mainImage || !category || !openHours) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const place = await Place.findOne({ name });

    if (place) {
      return res.status(400).json({ message: "Place already exists" });
    }

    // Upload Main Image (from buffer for serverless)
    const mainImageFile = files.mainImage[0];
    const mainImageResult = await cloudinary.uploader.upload(
      `data:${mainImageFile.mimetype};base64,${mainImageFile.buffer.toString('base64')}`,
      { folder: "mangan_rek_places" }
    );

    // Upload Gallery Images
    let galleryImagesUrls = [];
    if (files.galleryImages) {
      const uploadPromises = files.galleryImages.map((file) =>
        cloudinary.uploader.upload(
          `data:${file.mimetype};base64,${file.buffer.toString('base64')}`,
          { folder: "mangan_rek_places" }
        )
      );

      const galleryImagesResults = await Promise.all(uploadPromises);
      galleryImagesUrls = galleryImagesResults.map((result) => result.secure_url);
    }

    const newPlace = new Place({
      name,
      description,
      address,
      location: JSON.parse(location),
      openHours: JSON.parse(openHours),
      mainImage: mainImageResult.secure_url,
      galleryImages: galleryImagesUrls,
      category: JSON.parse(category),
      priceRange,
      createdBy,
    });

    await newPlace.save();

    res.status(201).json({
      _id: newPlace._id,
      name: newPlace.name,
      description: newPlace.description,
      address: newPlace.address,
      location: newPlace.location,
      openHours: newPlace.openHours,
      mainImage: newPlace.mainImage,
      galleryImages: newPlace.galleryImages,
      category: newPlace.category,
      priceRange: newPlace.priceRange,
      createdBy: newPlace.createdBy,
    });
  } catch (error) {
    console.error("Error in addPlace controller:", error.message);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

export const getAllPlaces = async (req, res) => {
  try {
    const { categories, price, rating, search } = req.query;

    console.log("✅ Request diterima di backend dengan query:", req.query);
    const filter = {};

    // Category Logic
    if (categories) {
      filter.category = { $in: categories.split(",") }; // Mengubah string kategori menjadi array
    }

    // Price Logic
    if (price) {
      filter.priceRange = price;
    }

    if (rating) {
      filter.averageRating = { $gte: Number(rating) };
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { address: { $regex: search, $options: "i" } },
      ];
    }

    const places = await Place.find(filter).populate("category").populate("createdBy", "fullName profilePic");
    res.status(200).json(places);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getTrendingPlaces = async (req, res) => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const trendingPlaceIds = await Rating.aggregate([
      { $match: { createdAt: { $gte: thirtyDaysAgo } } },
      { $group: { _id: "$place", recentReviews: { $sum: 1 } } },
      { $sort: { recentReviews: -1 } },
      { $limit: 5 },
    ]);

    let trendingPlaces = [];

    if (trendingPlaceIds.length > 0) {
      const placeIds = trendingPlaceIds.map((item) => item._id);
      trendingPlaces = await Place.find({ _id: { $in: placeIds } })
        .populate("category")
        .populate("createdBy", "fullName profilePic");
    }

    // Jika tidak ada trending, fallback ke newest places
    if (trendingPlaces.length === 0) {
      trendingPlaces = await Place.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .populate("category")
        .populate("createdBy", "fullName profilePic");
    }

    res.status(200).json(trendingPlaces);
  } catch (error) {
    console.error("Error in getTrendingPlaces:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getNewestPlaces = async (req, res) => {
  try {
    const newestPlaces = await Place.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("category")
      .populate("createdBy", "fullName profilePic");
    res.status(200).json(newestPlaces);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getPlaceBySlug = async (req, res) => {
  try {
    const place = await Place.findOne({ slug: req.params.slug })
      .populate("category")
      .populate("createdBy", "fullName profilePic");
    if (!place) {
      return res.status(404).json({ message: "Place not found" });
    }
    res.status(200).json(place);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updatePlace = async (req, res) => {
  try {
    const { id } = req.params;
    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid place id" });
    }

    const { name, description, address, location, openHours, category, priceRange } = req.body;
    const userId = req.user.id;

    const place = await Place.findById(id);
    if (!place) {
      return res.status(404).json({ message: "Place not found" });
    }

    if (place.createdBy.toString() !== userId) {
      return res.status(403).json({ message: "Unauthorized to update this place" });
    }

    // Update fields
    if (name) place.name = name;
    if (description) place.description = description;
    if (address) place.address = address;
    if (location) place.location = JSON.parse(location);
    if (openHours) place.openHours = JSON.parse(openHours);
    if (category) place.category = JSON.parse(category);
    if (priceRange) place.priceRange = priceRange;

    // Handle file uploads if provided
    const files = req.files;
    if (files && files.mainImage) {
      // Delete old main image from cloudinary
      if (place.mainImage) {
        const publicId = place.mainImage.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(`mangan_rek_places/${publicId}`);
      }
      // Upload new main image
      const mainImageResult = await cloudinary.uploader.upload(files.mainImage[0].path, {
        folder: "mangan_rek_places",
      });
      place.mainImage = mainImageResult.secure_url;
      fs.unlinkSync(files.mainImage[0].path);
    }

    if (files && files.galleryImages) {
      // Delete old gallery images
      if (place.galleryImages && place.galleryImages.length > 0) {
        for (const img of place.galleryImages) {
          const publicId = img.split("/").pop().split(".")[0];
          await cloudinary.uploader.destroy(`mangan_rek_places/${publicId}`);
        }
      }
      // Upload new gallery images
      const galleryUrls = [];
      for (const file of files.galleryImages) {
        const result = await cloudinary.uploader.upload(file.path, { folder: "mangan_rek_places" });
        galleryUrls.push(result.secure_url);
        fs.unlinkSync(file.path);
      }
      place.galleryImages = galleryUrls;
    }

    await place.save();

    res.status(200).json({
      _id: place._id,
      name: place.name,
      description: place.description,
      address: place.address,
      location: place.location,
      openHours: place.openHours,
      mainImage: place.mainImage,
      galleryImages: place.galleryImages,
      category: place.category,
      priceRange: place.priceRange,
      createdBy: place.createdBy,
    });
  } catch (error) {
    console.log("Error in updatePlace controller", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deletePlace = async (req, res) => {
  try {
    const { id } = req.params;
    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid place id" });
    }

    const userId = req.user.id;

    const place = await Place.findById(id);
    if (!place) {
      return res.status(404).json({ message: "Place not found" });
    }

    if (place.createdBy.toString() !== userId) {
      return res.status(403).json({ message: "Unauthorized to delete this place" });
    }

    // Delete main image from cloudinary
    if (place.mainImage) {
      const mainPublicId = place.mainImage.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(`mangan_rek_places/${mainPublicId}`);
    }

    // Delete gallery images from cloudinary
    if (place.galleryImages && place.galleryImages.length > 0) {
      for (const img of place.galleryImages) {
        const publicId = img.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(`mangan_rek_places/${publicId}`);
      }
    }

    // Delete place from DB
    await Place.findByIdAndDelete(id);

    res.status(200).json({ message: "Place removed" });
  } catch (error) {
    console.log("Error in deletePlace controller", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getMyContributions = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log("User ID in getMyContributions:", userId); // Debugging

    const contributions = await Place.find({ createdBy: userId })
      .sort({ createdAt: -1 }) // Urutkan dari yang terbaru
      .populate("category"); // (Opsional) Ambil detail kategori

    res.status(200).json(contributions);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getMyBookmarks = async (req, res) => {
  try {
    const userId = req.user.id;
    const limit = parseInt(req.query.limit) || 10; // default 10
    const skip = parseInt(req.query.skip) || 0; // default 0

    const user = await User.findById(userId).select("bookmarkedPlaces");
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user.bookmarkedPlaces || user.bookmarkedPlaces.length === 0) {
      return res.status(200).json({ bookmarks: [], total: 0 });
    }

    // Get total count for pagination
    const total = user.bookmarkedPlaces.length;

    // Apply pagination: slice the bookmarkedPlaces array and query only those
    const paginatedPlaceIds = user.bookmarkedPlaces.slice(skip, skip + limit);

    // Return minimal fields for bookmark list to save bandwidth
    const bookmarkedPlaces = await Place.find({ _id: { $in: paginatedPlaceIds } })
      .select("_id name slug mainImage category priceRange averageRating totalRating")
      .populate("category", "name");

    res.status(200).json({ bookmarks: bookmarkedPlaces, total });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const addBookmark = async (req, res) => {
  try {
    const userId = req.user.id;
    const { placeId } = req.params;
    // validate placeId
    if (!mongoose.Types.ObjectId.isValid(placeId)) {
      return res.status(400).json({ message: "Invalid place id" });
    }

    const place = await Place.findById(placeId);
    if (!place) {
      return res.status(404).json({ message: "Place not found" });
    }

    // Use $addToSet to avoid duplicates and return updated user populated with minimal place fields
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $addToSet: { bookmarkedPlaces: placeId } },
      { new: true }
    ).populate({
      path: "bookmarkedPlaces",
      select: "_id name slug mainImage category priceRange averageRating totalRating",
      populate: { path: "category", select: "name" },
    });

    res.status(201).json({ message: "Place added to bookmarks", bookmarkedPlaces: updatedUser.bookmarkedPlaces });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const removeBookmark = async (req, res) => {
  try {
    const userId = req.user.id;
    const { placeId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(placeId)) {
      return res.status(400).json({ message: "Invalid place id" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $pull: { bookmarkedPlaces: placeId } },
      { new: true }
    ).populate({
      path: "bookmarkedPlaces",
      select: "_id name slug mainImage category priceRange averageRating totalRating",
      populate: { path: "category", select: "name" },
    });

    res.status(200).json({ message: "Place removed from bookmarks", bookmarkedPlaces: updatedUser.bookmarkedPlaces });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
