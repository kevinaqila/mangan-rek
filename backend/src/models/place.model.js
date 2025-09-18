import mongoose from "mongoose";

const placeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
    address: {
        type: String,
        required: true,
        trim: true,
    },
    location: {
        type: {
            type: String,
            enum: ['Point'],
            required: true,
        },
        coordinates: {
            type: [Number],
            required: true,
        },
    },
    openHours: {
        type: {
            monday: { open: String, close: String },
            tuesday: { open: String, close: String },
            wednesday: { open: String, close: String },
            thursday: { open: String, close: String },
            friday: { open: String, close: String },
            saturday: { open: String, close: String },
            sunday: { open: String, close: String }
        },
        _id: false,
    },
    priceRange: {
        type: String,
        required: true,
        enum: ['Rp 0 - Rp 25.000', 'Rp 25.000 - Rp 50.000', 'Rp 50.000 - Rp 100.000']
    },
    mainImage: {
        type: String,
        required: true,
        trim: true,
    },
    galleryImages: {
        type: [String],
        default: [],
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true,
    },
    averageRating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
    },
    totalRating: {
        type: Number,
        default: 0
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    }
}, { timestamps: true });

placeSchema.pre("save", function(next) {
    if (this.isModified("name")) { this.slug = slugify(this.name, { lower: true, strict: true }) }
    next();
});

placeSchema.index({ location: '2dsphere' });

const Place = mongoose.model("Place", placeSchema);

export default Place;