
const express = require("express");
const Product = require("../models/Product");
const { protect, adminOnly } = require("../middleware/auth");

const router = express.Router();

// Get all products
router.get("/", async (req, res) => {
    try {
        const products = await Product.find();

        res.json({
            success: true,
            count: products.length,
            products
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Get single product
router.get("/:id", async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found."
            });
        }

        res.json({
            success: true,
            product
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: "Invalid product ID."
        });
    }
});

// Create product (Admin only)
router.post("/", protect, adminOnly, async (req, res) => {
    try {
        const { name, description, price, stock, category } = req.body;

        const product = await Product.create({
            name,
            description,
            price,
            stock,
            category
        });

        res.status(201).json({
            success: true,
            message: "Product created successfully.",
            product
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
});

// Update product (Admin only)
// Update product (Admin only)
router.put("/:id", protect, adminOnly, async (req, res) => {
    try {
        const allowedFields = [
            "name",
            "description",
            "price",
            "stock",
            "category"
        ];

        const updates = {};

        for (const field of allowedFields) {
            if (req.body[field] !== undefined) {
                updates[field] = req.body[field];
            }
        }

        if (Object.keys(updates).length === 0) {
            return res.status(400).json({
                success: false,
                message: "No valid fields provided for update."
            });
        }

        const product = await Product.findByIdAndUpdate(
            req.params.id,
            updates,
            { new: true, runValidators: true }
        );

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found."
            });
        }

        res.json({
            success: true,
            message: "Product updated successfully.",
            product
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
});
// Delete product (Admin only)
router.delete("/:id", protect, adminOnly, async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found."
            });
        }

        res.json({
            success: true,
            message: "Product deleted successfully."
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: "Invalid product ID."
        });
    }
});

module.exports = router;
