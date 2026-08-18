const restaurantsService = require("../services/restaurants");
const productsService = require("../services/products");
const {
    postRestaurantValidator,
    updateRestaurantValidator,
} = require("../validators/restaurants");

const getAllRestaurants = async (req, res) => {
    try {
        const userId = req.user.userId;
        const data = await restaurantsService.getAllRestaurants(userId);

        if (data === null) {
            return res.status(500).json({ error: "Failed to get restaurants" });
        }

        res.json(data);
    } catch (error) {
        console.error("getAllRestaurants error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

const getRestaurantById = async (req, res) => {
    try {
        const userId = req.user.userId;
        const id = req.params.id;

        const data = await restaurantsService.getRestaurantById(id, userId);

        if (data === null) {
            return res.status(500).json({ error: "Failed to get restaurant" });
        }

        if (!data) {
            return res.status(404).json({ error: "Restaurant not found" });
        }

        let restaurantObject = typeof data.toObject === "function" ? data.toObject() : data;

        try {
            // קריאה לפונקציה הנכונה מהסרוויס שלך: getAllProducts
            const products = await productsService.getAllProducts(id) || [];
            restaurantObject.products = products;
        } catch (prodError) {
            console.error("Failed to fetch products for restaurant:", prodError);
            restaurantObject.products = [];
        }

        res.json(restaurantObject);
    } catch (error) {
        console.error("getRestaurantById error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

const getAllRestaurantsByCategory = async (req, res) => {
    try {
        const userId = req.user.userId;
        const categoryName = req.params.categoryName;

        const data = await restaurantsService.getAllRestaurantsByCategory(
            categoryName,
            userId
        );

        if (data === null) {
            return res.status(500).json({ error: "Failed to get restaurants" });
        }

        res.json(data);
    } catch (error) {
        console.error("getAllRestaurantsByCategory error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

const getNearbyRestaurants = async (req, res) => {
    try {
        const userId = req.user.userId;
        const data = await restaurantsService.getNearbyRestaurants(userId);

        if (data === null) {
            return res.status(500).json({ error: "Failed to get nearby restaurants" });
        }

        res.json(data);
    } catch (error) {
        console.error("getNearbyRestaurants error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

const getUserOwnerRestaurants = async (req, res) => {
    try {
        const userId = req.params.userId;
        const data = await restaurantsService.getRestaurantsByUserOwner(userId);

        if (data === null) {
            return res.status(500).json({ error: "Failed to get restaurants" });
        }

        res.json(data);
    } catch (error) {
        console.error("getUserOwnerRestaurants error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

const postRestaurant = async (req, res) => {
    try {
        const { isValid, message } = postRestaurantValidator(req.body);

        if (!isValid) {
            return res.status(400).json({ error: message });
        }

        const data = await restaurantsService.postRestaurant(req.body);

        if (data === null) {
            return res.status(500).json({ error: "Failed to create restaurant" });
        }

        res.status(201).json(data);
    } catch (error) {
        console.error("postRestaurant error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

const updateRestaurant = async (req, res) => {
    try {
        const { isValid, message } = updateRestaurantValidator(req.body);

        if (!isValid) {
            return res.status(400).json({ error: message });
        }

        const id = req.params.id;
        const data = await restaurantsService.updateRestaurant(id, req.body);

        if (data === null) {
            return res.status(500).json({ error: "Failed to update restaurant" });
        }

        if (!data) {
            return res.status(404).json({ error: "Restaurant not found" });
        }

        res.json(data);
    } catch (error) {
        console.error("updateRestaurant error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

const deleteRestaurant = async (req, res) => {
    try {
        const id = req.params.id;
        const data = await restaurantsService.deleteRestaurant(id);

        if (data === null) {
            return res.status(500).json({ error: "Failed to delete restaurant" });
        }

        if (!data) {
            return res.status(404).json({ error: "Restaurant not found" });
        }

        res.status(204).send();
    } catch (error) {
        console.error("deleteRestaurant error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

module.exports = {
    getAllRestaurants,
    getRestaurantById,
    getAllRestaurantsByCategory,
    getNearbyRestaurants,
    getUserOwnerRestaurants,
    postRestaurant,
    updateRestaurant,
    deleteRestaurant,
};