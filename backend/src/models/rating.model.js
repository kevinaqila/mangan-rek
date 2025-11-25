import mongoose from "mongoose";
import Place from "./place.model.js";

const ratingSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true,
        trim: true,
    },
    rate: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
    },
    image: {
        type: [String],
        default: [],
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    place: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Place",
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
}, { timestamps: true });

ratingSchema.index({ user: 1, place: 1 }, { unique: true });

// Removed post hook that was causing timeout
// Rating updates will be handled manually in controller

ratingSchema.statics.updatePlaceRating = async function(placeId) {
    try {
        const stats = await this.aggregate([
            { $match: { place: placeId } },
            {
                $group: {
                    _id: '$place',
                    totalRating: { $sum: 1 },
                    averageRating: { $avg: '$rate' }
                }
            }
        ]);

        if (stats.length > 0) {
            await Place.findByIdAndUpdate(placeId, {
                totalRating: stats[0].totalRating,
                averageRating: stats[0].averageRating.toFixed(1)
            });
        } else {
            await Place.findByIdAndUpdate(placeId, {
                totalRating: 0,
                averageRating: 0
            });
        }
    } catch (error) {
        console.error("Error updating place rating:", error);
    }
};

const Rating = mongoose.model("Rating", ratingSchema);

export default Rating;