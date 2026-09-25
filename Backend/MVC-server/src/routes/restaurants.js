const productsController = require("../controllers/products");
const router = require("express").Router();

const restaurants = require("../controllers/restaurants");
const productsRouter = require("./products");
const auth = require("../middleware/auth");
const { checkUserExists } = require("../middleware/userCheckMiddleware");

// Middleware to check if user is authenticated, used for all routes in this router
router.use(auth);
// middleware to check if user that is connected exists, used for all routes in this router
router.use(checkUserExists);

// Declaration of routes for restaurants, each route calls the relevant controller function
router.get("/", restaurants.getAllRestaurants);
router.post("/", restaurants.postRestaurant);

// Nested routes for products related to a specific restaurant - all routes in productsRouter need restaurant ID.
router.use("/:id/products", productsRouter);
router.get("/:id/recommendations/:productId", productsController.getRecommendations);
router.get("/:id/recommendations/:pid", productsController.getRecommendations);
router.get("/:id/recommandations/:productId", productsController.getRecommendations);
router.get("/:id/recommandations/:pid", productsController.getRecommendations);

router.get("/nearbyRestaurants", restaurants.getNearbyRestaurants);
router.get("/userOwner/:userId", restaurants.getUserOwnerRestaurants);
router.get("/category/:categoryName", restaurants.getAllRestaurantsByCategory);
router.get("/:id", restaurants.getRestaurantById);
router.patch("/:id", restaurants.updateRestaurant);
router.delete("/:id", restaurants.deleteRestaurant);

module.exports = router;
