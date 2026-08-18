const restaurants = require("../services/restaurants");
const products = require("../services/products");

// Function gets restaurants and products whose name or description contains the string query
const searchRestaurantsAndProducts = async (query) => {
    const matchedRestaurants = await restaurants.getRestaurantsByName(query) || [];
    const matchedProducts = await products.getProductsByName(query) || [];

    const mappedRestaurants = matchedRestaurants.map(r => {
        const obj = r.toObject ? r.toObject({ virtuals: true }) : r;
        return {
            ...obj,
            id: obj.id || obj._id?.toString(),
            type: "restaurant"
        };
    });

    const mappedProducts = matchedProducts.map(p => {
        const obj = p.toObject ? p.toObject({ virtuals: true }) : p;
        return {
            ...obj,
            id: obj.id || obj._id?.toString(),
            type: "product"
        };
    });

    return [...mappedRestaurants, ...mappedProducts];
};

module.exports = {
    searchRestaurantsAndProducts,
};
