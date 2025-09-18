import mongoose from "mongoose";

const ratingSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true,
        trim: true,
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
    },
    image: {
        type: String,
        default: "",
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

const Rating = mongoose.model("Rating", ratingSchema);

export default Rating;