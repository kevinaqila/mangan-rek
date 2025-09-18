import Place from "../models/place.model.js";

export const addPlace = async(req, res) => {
    try {
        const { name, description, address, priceRange } = req.body;
        const createdBy = req.user.id;

        if (!name || !description || !address || !priceRange) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const place = await Place.findOne({ name });

        if (place) {
            return res.status(400).json({ message: "Place already exists" });
        }

        const newPlace = new Place({
            name,
            description,
            address,
            priceRange,
            createdBy
        })

        await newPlace.save();

        res.status(201).json({
            _id: newPlace._id,
            name: newPlace.name,
            description: newPlace.description,
            address: newPlace.address,
            priceRange: newPlace.priceRange,
            createdBy: newPlace.createdBy
        });
    } catch (error) {
        console.log("Error in addPlace controller", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const getAllPlaces = async(req, res) => {
    try {
        const places = await Place.find().populate("category").populate("createdBy", "fullName profilePic");
        res.status(200).json(places);
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
}

export const getPlaceById = async(req, res) => {
    try {
        const place = await Place.findById(req.params.id).populate("category").populate("createdBy", "fullName profilePic");
        if (!place) {
            return res.status(404).json({ message: "Place not found" });
        }
        res.status(200).json(place);
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
}

export const updatePlace = async(req, res) => {
    try {
        const updatedPlace = await Place.findByIdAndUpdate(
            req.params.id, { $set: req.body }, { new: true, runValidators: true }
        );

        if (!updatedPlace) {
            return res.status(404).json({ message: "Place not found" });
        }
        res.status(200).json(updatedPlace);
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};

export const deletePlace = async(req, res) => {
    try {
        const place = await Place.findByIdAndDelete(req.params.id);
        if (!place) {
            return res.status(404).json({ message: "Place not found" });
        }
        res.status(200).json({ message: "Place removed" });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
}