// Orders routes
const express = require("express");
var router = express.Router();
const auth = require("../middleware/auth");
const { checkUserExists } = require("../middleware/userCheckMiddleware");

// Authentication
router.use(auth);
router.use(checkUserExists);

const orders = require("../controllers/orders");
router.get("/", orders.getAllOrders);
router.get("/:id", orders.getOrderById);
router.post("/", orders.createOrder);
router.patch("/:id", orders.updateOrder);
router.delete("/:id", orders.deleteOrder);

module.exports = router;
