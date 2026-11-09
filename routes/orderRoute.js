
const express = require("express");

const Cart = require("../models/Cart");
const Order = require("../models/Order");
const Product = require("../models/Product");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.use(protect);

// Place a new order
router.post("/", async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id })
            .populate("items.product");

        if (!cart || cart.items.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Your cart is empty."
            });
        }

        const orderItems = [];
        let totalAmount = 0;
        const stockUpdates = [];

        for (const item of cart.items) {
            const product = item.product;

            if (!product) {
                return res.status(404).json({
                    success: false,
                    message: "A product in your cart no longer exists."
                });
            }

            if (product.stock < item.quantity) {
                return res.status(400).json({
                    success: false,
                    message: `Insufficient stock for ${product.name}.`
                });
            }

            orderItems.push({
                product: product._id,
                productName: product.name,
                quantity: item.quantity,
                price: product.price
            });

            totalAmount += product.price * item.quantity;

            stockUpdates.push({
                productId: product._id,
                quantity: item.quantity
            });
        }

        const updatedProducts = [];

        try {
            // Reserve stock for every product
            for (const update of stockUpdates) {
                const product = await Product.findOneAndUpdate(
                    {
                        _id: update.productId,
                        stock: { $gte: update.quantity }
                    },
                    {
                        $inc: { stock: -update.quantity }
                    },
                    { new: true }
                );

                if (!product) {
                    throw new Error("Insufficient stock. Please try again.");
                }

                updatedProducts.push(update);
            }

            const order = await Order.create({
    user: req.user._id,
    items: orderItems,
    totalAmount
});

try {
    cart.items = [];
    await cart.save();
} catch (cartError) {
    await Order.findByIdAndDelete(order._id);
    throw cartError;
}

            return res.status(201).json({
                success: true,
                message: "Order placed successfully.",
                order
            });

        } catch (error) {
            // Restore reserved stock if order creation fails
            for (const update of updatedProducts) {
                await Product.updateOne(
                    { _id: update.productId },
                    { $inc: { stock: update.quantity } }
                );
            }

            throw error;
        }

    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
});

// Get logged-in user's orders
router.get("/", async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id })
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            count: orders.length,
            orders
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Get a specific order belonging to the logged-in user
router.get("/:id", async (req, res) => {
    try {
        const order = await Order.findOne({
            _id: req.params.id,
            user: req.user._id
        });

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found."
            });
        }

        res.json({
            success: true,
            order
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: "Invalid order ID."
        });
    }
});

module.exports = router;
