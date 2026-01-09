import bcrypt from "bcryptjs";

import User from "../models/user.model.js";
import { generateToken } from "../lib/utils.js";

export const signup = async (req, res) => {
  const { fullName, email, password } = req.body;
  const startTime = Date.now();

  try {
    console.log(`[SIGNUP] Starting signup for ${email}`);
    
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 8) {
      return res.status(400).json({ message: "password must be at least 8 characters" });
    }

    const checkStart = Date.now();
    const user = await User.findOne({ email: email.toLowerCase() });
    console.log(`[SIGNUP] User check took ${Date.now() - checkStart}ms`);
    
    if (user) return res.status(400).json({ message: "User already exists" });

    const hashStart = Date.now();
    const salt = await bcrypt.genSalt(8); // Reduced from 10 to 8 for faster hashing
    const hashedPassword = await bcrypt.hash(password, salt);
    console.log(`[SIGNUP] Password hashing took ${Date.now() - hashStart}ms`);

    const newUser = new User({
      fullName,
      email: email.toLowerCase(),
      password: hashedPassword,
    });

    const saveStart = Date.now();
    await newUser.save();
    console.log(`[SIGNUP] User save took ${Date.now() - saveStart}ms`);
    
    const token = generateToken(newUser._id);
    const totalTime = Date.now() - startTime;
    console.log(`[SIGNUP] Total signup time: ${totalTime}ms`);

    res.status(201).json({
      message: "User created successfully",
      token,
      user: {
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        role: newUser.role,
        profilePic: newUser.profilePic,
        bio: newUser.bio,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  const startTime = Date.now();
  
  try {
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    console.log(`[LOGIN] Starting login for ${email}`);
    
    const findUserStart = Date.now();
    const user = await User.findOne({ email: email.toLowerCase() }).select("+password");
    const findUserTime = Date.now() - findUserStart;
    console.log(`[LOGIN] User lookup took ${findUserTime}ms`);

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const compareStart = Date.now();
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    const compareTime = Date.now() - compareStart;
    console.log(`[LOGIN] Password compare took ${compareTime}ms`);

    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user._id);
    const totalTime = Date.now() - startTime;
    console.log(`[LOGIN] Total login time: ${totalTime}ms`);
    
    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        profilePic: user.profilePic,
        bio: user.bio,
      },
    });
  } catch (error) {
    console.error("Error in login controller:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const logout = (req, res) => {
  res.status(200).json({ message: "Logged out successfully" });
};

export const checkAuth = async (req, res) => {
  try {
    const user = req.user;
    res.status(200).json({
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        profilePic: user.profilePic,
        bio: user.bio,
      },
    });
  } catch (error) {
    console.log("Error in checkAuth controller", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;
    const userId = req.user._id;

    const user = await User.findById(userId).select("+password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect current password" });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ message: "New password must be at least 8 characters" });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "New password and confirmation do not match" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    await user.save();
    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.log("Error in changePassword controller", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
