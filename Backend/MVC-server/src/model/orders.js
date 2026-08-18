const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    productsList: [
        {
            restaurantAndProduct: {
                productId: { type: String, required: true },
                restaurantId: { type: String, required: true }
            },
            price: { type: Number },
            amount: { type: Number, default: 1 }
        }
    ],
    totalPrice: { type: Number, required: true, default: 0 },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Order", orderSchema);