const router = require("express").Router({ mergeParams: true });

const products = require("../controllers/products");
const auth = require("../middleware/auth");
const { checkRestaurantExists } = require("../middleware/restaurantMiddleware");
const { checkUserExists } = require("../middleware/userCheckMiddleware");

// Middleware to check if user is authenticated, used for all routes in this router
router.use(auth);
// middleware to check if user that is connected exists, used for all routes in this router
router.use(checkUserExists);
// middleware to check if restaurant exists, used for all routes in this router
router.use(checkRestaurantExists);

// Declaration of routes for products, each route calls the relevant controller function
router.get("/", products.getAllProducts);
router.post("/", products.postProduct);
router.get("/recommendations/:productId", products.getRecommendations);
router.get("/recommendations/:pid", products.getRecommendations);
router.get("/recommandations/:productId", products.getRecommendations);
router.get("/recommandations/:pid", products.getRecommendations);
router.get("/:pid", products.getProductById);
router.patch("/:pid", products.updateProduct);
router.delete("/:pid", products.deleteProduct);

module.exports = router;
