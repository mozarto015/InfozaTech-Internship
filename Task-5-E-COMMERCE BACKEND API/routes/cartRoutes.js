
const express = require("express");
const mongoose = require("mongoose");

const Cart = require("../models/Cart");
const Product = require("../models/Product");
const { protect } = require("../middleware/auth");

const router = express.Router();

// All cart routes require login
router.use(protect);

// View cart
router.get("/", async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id })
            .populate("items.product", "name price stock category");

        res.json({
            success: true,
            cart: cart || { items: [] }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Add item to cart
router.post("/items", async (req, res) => {
    try {
        const { productId, quantity = 1 } = req.body;

        if (!mongoose.isValidObjectId(productId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid product ID."
            });
        }

        if (!Number.isInteger(quantity) || quantity < 1) {
            return res.status(400).json({
                success: false,
                message: "Quantity must be a positive integer."
            });
        }

        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found."
            });
        }

        let cart = await Cart.findOne({ user: req.user._id });

        if (!cart) {
            cart = new Cart({ user: req.user._id, items: [] });
        }

        const itemIndex = cart.items.findIndex(
            item => item.product.toString() === productId
        );

        const currentQuantity =
            itemIndex === -1 ? 0 : cart.items[itemIndex].quantity;

        if (currentQuantity + quantity > product.stock) {
            return res.status(400).json({
                success: false,
                message: "Not enough stock available."
            });
        }

        if (itemIndex === -1) {
            cart.items.push({ product: productId, quantity });
        } else {
            cart.items[itemIndex].quantity += quantity;
        }

        await cart.save();
        await cart.populate("items.product", "name price stock category");

        res.status(200).json({
            success: true,
            message: "Item added to cart.",
            cart
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Update item quantity
router.put("/items/:productId", async (req, res) => {
    try {
        const { quantity } = req.body;
        const { productId } = req.params;

        if (!mongoose.isValidObjectId(productId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid product ID."
            });
        }

        if (!Number.isInteger(quantity) || quantity < 1) {
            return res.status(400).json({
                success: false,
                message: "Quantity must be a positive integer."
            });
        }

        const cart = await Cart.findOne({ user: req.user._id });
        const product = await Product.findById(productId);

        if (!cart || !product) {
            return res.status(404).json({
                success: false,
                message: "Cart or product not found."
            });
        }

        if (quantity > product.stock) {
            return res.status(400).json({
                success: false,
                message: "Not enough stock available."
            });
        }

        const item = cart.items.find(
            item => item.product.toString() === productId
        );

        if (!item) {
            return res.status(404).json({
                success: false,
                message: "Item not found in cart."
            });
        }

        item.quantity = quantity;

        await cart.save();
        await cart.populate("items.product", "name price stock category");

        res.json({
            success: true,
            message: "Cart quantity updated.",
            cart
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Remove item from cart
router.delete("/items/:productId", async (req, res) => {
    try {
        const { productId } = req.params;

        if (!mongoose.isValidObjectId(productId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid product ID."
            });
        }

        const cart = await Cart.findOne({ user: req.user._id });

        if (!cart) {
            return res.status(404).json({
                success: false,
                message: "Cart not found."
            });
        }

        const initialLength = cart.items.length;

        cart.items = cart.items.filter(
            item => item.product.toString() !== productId
        );

        if (cart.items.length === initialLength) {
            return res.status(404).json({
                success: false,
                message: "Item not found in cart."
            });
        }

        await cart.save();

        res.json({
            success: true,
            message: "Item removed from cart.",
            cart
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

module.exports = router;
