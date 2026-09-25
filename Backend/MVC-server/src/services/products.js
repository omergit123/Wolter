const Product = require("../model/products");
const orders = require("../services/orders");
const socket = require("./socket");

const getAllProducts = async (restaurantId) => {
    try {
        return await Product.find({ restaurantId });
    } catch (error) {
        throw error;
    }
};

const getProductPriceById = async (restaurantId, productId) => {
    try {
        const output = await Product.findOne({ restaurantId, _id: productId });
        if (!output) {
            return {
                success: false,
                status: 404,
                message: "Product not found",
            };
        }
        return output.price;
    } catch (error) {
        throw error;
    }
};

const getProductById = async (userId, restaurantId, productId) => {
    try {
        let output = await Product.findOne({ restaurantId, _id: productId });
        if (!output) {
            output = await Product.findById(productId);
        }

        if (!output) {
            return {
                success: false,
                status: 404,
                message: "Product not found",
            };
        }

        const socketOutput = await socket.addProduct(userId, productId);
        if (!socketOutput) {
            return {
                success: false,
                status: 500,
                message: "Failed to add product to recommendations",
            };
        }

        return {
            success: true,
            status: 200,
            message: "Product found",
            data: output,
        };
    } catch (error) {
        throw error;
    }
};

const getRecommendations = async (userId, productId) => {
    try {
        // Ensure user and product exist in recommendation engine
        await socket.addProduct(userId, productId);

        const output = await socket.getRecommendations(userId, productId);
        if (output === null || output === false) {
            return {
                success: true,
                status: 200,
                data: [],
            };
        }
        return {
            success: true,
            status: 200,
            data: output,
        };
    } catch (error) {
        throw error;
    }
};

const postProduct = async (restaurantId, dataToPost) => {
    try {
        const product = new Product({
            ...dataToPost,
            restaurantId,
        });
        return await product.save();
    } catch (error) {
        throw error;
    }
};

const updateProduct = async (restaurantId, productId, dataToUpdate) => {
    try {
        return await Product.findOneAndUpdate(
            { restaurantId, _id: productId },
            dataToUpdate,
            { returnDocument: "after", runValidators: true },
        );
    } catch (error) {
        throw error;
    }
};

const deleteProduct = async (restaurantId, productId) => {
    try {
        const exists = await Product.findOne({ restaurantId, _id: productId });

        if (!exists) {
            return {
                success: false,
                status: 404,
                message: "Product not found",
            };
        }

        orders.deleteProductFromOrders(productId);

        if (!(await socket.deleteProduct(productId))) {
            return {
                success: false,
                status: 500,
                message: "Failed to delete product from recommendations",
            };
        }

        const deleted = await Product.findOneAndDelete({
            restaurantId,
            _id: productId,
        });

        if (!deleted) {
            return {
                success: false,
                status: 500,
                message: "Failed to delete product from database",
            };
        }

        return {
            success: true,
            status: 204,
            message: "Product deleted successfully",
        };
    } catch (error) {
        throw error;
    }
};

const getProductsByName = async (query) => {
    try {
        const lowerQuery = query.toLowerCase();
        return await Product.find({
            $or: [
                { name: { $regex: lowerQuery, $options: "i" } },
                { description: { $regex: lowerQuery, $options: "i" } },
            ],
        });
    } catch (error) {
        throw error;
    }
};

module.exports = {
    getAllProducts,
    getProductById,
    getRecommendations,
    postProduct,
    updateProduct,
    deleteProduct,
    getProductsByName,
    getProductPriceById,
};