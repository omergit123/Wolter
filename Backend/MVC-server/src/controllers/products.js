const products = require("../services/products");
const {
    postProductValidator,
    updateProductValidator,
} = require("../validators/products");

const getAllProducts = async (req, res, next) => {
    try {
        const restaurantId = req.params.id;

        const productsList = await products.getAllProducts(restaurantId);

        if (!productsList) {
            return res.status(500).json({ error: "Failed to get products" });
        }

        res.json(productsList);
    } catch (error) {
        next(error);
    }
};

const getProductById = async (req, res, next) => {
    try {
        const restaurantId = req.params.id;
        const pid = req.params.pid;
        const userId = req.user.userId;

        const product = await products.getProductById(
            userId,
            restaurantId,
            pid
        );

        if (!product.success) {
            return res.status(product.status).json({ error: product.message });
        }

        res.json(product.data);
    } catch (error) {
        next(error);
    }
};

const getRecommendations = async (req, res, next) => {
    try {
        const productId = req.params.productId || req.params.pid;
        const userId = req.user.userId;

        const result = await products.getRecommendations(userId, productId);

        if (!result || !result.success) {
            return res
                .status(result?.status || 500)
                .json({ error: result?.message || "Failed to get recommendations" });
        }

        res.json(result.data);
    } catch (error) {
        next(error);
    }
};

const postProduct = async (req, res, next) => {
    try {
        const { isValid, message } = postProductValidator(req.body);

        if (!isValid) {
            return res.status(400).json({ error: message });
        }

        const restaurantId = req.params.id;

        const product = await products.postProduct(restaurantId, req.body);

        if (!product) {
            return res.status(500).json({ error: "Failed to create product" });
        }

        res.status(201).send();
    } catch (error) {
        next(error);
    }
};

const updateProduct = async (req, res, next) => {
    try {
        const { isValid, message } = updateProductValidator(req.body);

        if (!isValid) {
            return res.status(400).json({ error: message });
        }

        const restaurantId = req.params.id;
        const productId = req.params.productId || req.params.pid;

        const product = await products.updateProduct(
            restaurantId,
            productId,
            req.body
        );

        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }

        res.status(204).send();
    } catch (error) {
        next(error);
    }
};

const deleteProduct = async (req, res, next) => {
    try {
        const restaurantId = req.params.id;
        const productId = req.params.productId || req.params.pid;

        const output = await products.deleteProduct(restaurantId, productId);

        if (!output.success) {
            return res.status(output.status).json({ error: output.message });
        }

        res.status(204).send();
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAllProducts,
    getProductById,
    getRecommendations,
    postProduct,
    updateProduct,
    deleteProduct,
};