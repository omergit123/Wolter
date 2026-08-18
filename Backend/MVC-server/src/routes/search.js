const router = require("express").Router();

const search = require("../controllers/search");

// Declaration of route for search, each route calls the relevant controller function
router.get("/:query", search.searchRestaurantsAndProducts);

module.exports = router;
