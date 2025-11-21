import Category from "../models/category.model.js";
import Place from "../models/place.model.js";

export const addCategory = async(req, res) => {
    try {
        const { name } = req.body;
        if (!name) {
            return res.status(400).json({ message: "Category name is required" });
        }

        const category = await Category.findOne({ name });

        if (category) {
            return res.status(400).json({ message: "Category already exists" });
        }

        const newCategory = new Category({ name });
        await newCategory.save();

        res.status(201).json({
            _id: newCategory._id,
            name: newCategory.name,
            slug: newCategory.slug
        });


    } catch (error) {
        console.log("Error in addCategory controller", error.message);
        res.status(500).json({ message: "Internal server error" });

    }
}

export const getCategories = async(req, res) => {
    try {
        const categories = await Category.find().sort({ createdAt: -1 });
        res.status(200).json(categories);
    } catch (error) {
        console.log("Error in getCategories controller", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
}



export const updateCategory = async(req, res) => {
    try {
        const { name } = req.body;
        const { id } = req.params;

        if (!name) {
            return res.status(400).json({ message: "Category name is required" });
        }

        const category = await Category.findById(id);

        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }

        const existingCategory = await Category.findOne({ name });
        if (existingCategory && existingCategory._id.toString() !== id) {
            return res.status(400).json({ message: "Category name already in use" });
        }

        category.name = name;
        await category.save();

        res.status(200).json({
            _id: category._id,
            name: category.name,
            slug: category.slug
        });
    } catch (error) {
        console.log("Error in updateCategory controller", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
}