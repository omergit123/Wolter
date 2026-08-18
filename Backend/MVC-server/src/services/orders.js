const Order = require("../model/orders");

// Returns all the orders of the user
const getAllOrders = async (userId) => {
    try {
        return await Order.find({ userId: userId }).lean();
    } catch (error) {
        console.error("Error fetching orders:", error);
        return null;
    }
};

// Returns Orders object by ID
const getOrderById = async (id) => {
    try {
        return await Order.findById(id).lean();
    } catch (error) {
        console.error("Error fetching order by ID:", error);
        return null;
    }
};

// Creating a new order
const createOrder = async (orderData) => {
    try {
        const totalPrice = await calculateTotalPrice(orderData.productsList);
        const newOrder = new Order({
            ...orderData,
            totalPrice: totalPrice
        });
        return await newOrder.save();
    } catch (error) {
        console.error("Error creating order:", error);
        return null;
    }
};

// Update an existing order
const updateOrder = async (id, orderData) => {
    try {
        const updateFields = { ...orderData };
        if (orderData.productsList !== undefined) {
            updateFields.totalPrice = await calculateTotalPrice(orderData.productsList);
        }

        return await Order.findByIdAndUpdate(
            id,
            { $set: updateFields },
            { new: true, runValidators: true }
        ).lean();
    } catch (error) {
        console.error("Error updating order:", error);
        return null;
    }
};

// Deleting an order
const deleteOrder = async (id) => {
    try {
        const result = await Order.findByIdAndDelete(id);
        return result ? true : null;
    } catch (error) {
        console.error("Error deleting order:", error);
        return null;
    }
};

// deleting a product from all orders and updating total price
const deleteProductFromOrders = async (productId) => {
    try {
        const relevantOrders = await Order.find({ "productsList.restaurantAndProduct.productId": productId });

        if (relevantOrders.length === 0) {
            return true;
        }

        await Order.updateMany(
            { "productsList.restaurantAndProduct.productId": productId },
            { $pull: { productsList: { "restaurantAndProduct.productId": productId } } }
        );

        // Updating the new prices
        for (let order of relevantOrders) {
            const updatedOrder = await Order.findById(order._id).lean();
            const newTotalPrice = await calculateTotalPrice(updatedOrder.productsList);
            await Order.findByIdAndUpdate(order._id, { $set: { totalPrice: newTotalPrice } });
        }
    } catch (error) {
        console.error("Error deleting product from orders:", error);
        return false;
    }
};

// Helper function to calculate the price - it's async because it uses DB model
const calculateTotalPrice = async (productsList) => {
    const products = require("../services/products");

    if (!productsList || !Array.isArray(productsList)) {
        return 0;
    }

    let total = 0;
    for (const product of productsList) {
        if (!product.restaurantAndProduct) continue;

        const resId = product.restaurantAndProduct.restaurantId;
        const prodId = product.restaurantAndProduct.productId;

        // await for products DB.
        const rawPrice = await products.getProductPriceById(resId, prodId);
        const price = rawPrice ? parseFloat(rawPrice) : 0;

        const quantity = product.amount || 1;
        total += (price * quantity);
    }

    return total;
};;

module.exports = {
    getAllOrders,
    getOrderById,
    createOrder,
    updateOrder,
    deleteOrder,
    deleteProductFromOrders
};