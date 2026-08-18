const search = require("../services/search");

/*
 * Function gets search query, returns an array of matching restaurants and products to the client
 * or 500 error if search fails
 */
const searchRestaurantsAndProducts = async (req, res) => {
    const query = req.params.query;
    const result = [];

    try {
        const filteredRestaurants =
            await search.searchRestaurantsAndProducts(query);
        if (!filteredRestaurants) {
            return res
                .status(500)
                .json({ error: "Failed to search restaurants and products" });
        }

        result.push(...filteredRestaurants);
        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Failed to search restaurants and products",
        });
    }
};

module.exports = {
    searchRestaurantsAndProducts,
};
