const restaurants = require("../services/restaurants");

// Middleware function to check if restaurant exists before allowing access to product routes
const checkRestaurantExists = async (req, res, next) => {
    const restaurantId = req.params.restaurantId || req.params.id;
    const restaurant = await restaurants.getRestaurantById(restaurantId);

    if (!restaurant) {
        return res.status(404).json({ error: "Restaurant not found" });
    }

    next();
};

module.exports = { checkRestaurantExists };
