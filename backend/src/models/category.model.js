import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        maxlength: 20,
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    }
}, { timestamps: true });

const Category = mongoose.model("Category", categorySchema);

export default Category