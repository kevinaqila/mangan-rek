import bcrypt from "bcryptjs";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
        select: false,
    },
    role:{
        type: String,
        enum: ["admin", "contributor", "user"],
        default: "user",
    },
    profilePic: {
        type: String,
        default: "",
    },
    bio: {
        type: String,
        maxlength: 100,
        default: "",
    },
    bookmarkedPlaces: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Place",
    }],
}, { timestamps: true });

userSchema.methods.comparePassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;