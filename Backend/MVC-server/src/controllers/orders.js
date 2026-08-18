const orders = require("../services/orders");
const {
    createOrderValidator,
    updateOrderValidator,
} = require("../validators/orders");

/*
 * This function returns an array of all the current orders
 * 500 error will send if the retrieval fails.
 */
const getAllOrders = async (req, res) => {
    try {
        const userId = req.headers["user-id"];
        const ordersList = await orders.getAllOrders(userId);

        if (!ordersList) {
            return res.status(500).json({ error: "Failed to get Orders" });
        }

        res.json(ordersList);
    } catch (error) {
        console.error("Controller Error in getAllOrders:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

/*
 * This function returns an object of the order with the given ID
 * 404 Error if not found
 */
const getOrderById = async (req, res) => { // async
    try {
        const id = req.params.id;
        const order = await orders.getOrderById(id); // await

        if (!order) {
            return res.status(404).json({ error: "Order not found" });
        }

        res.json(order);
    } catch (error) {
        console.error("Controller Error in getOrderById:", error);
        if (error.name === "CastError") {
            return res.status(400).json({ error: "Invalid Order ID format" });
        }
        res.status(500).json({ error: "Internal Server Error" });
    }
};

/*
 * Function that creates a new order with the given data, returns 201 status to the client if successful,
 * 400 error if validation fails
 * 500 error if order creation failed
 */
const createOrder = async (req, res) => { // async
    try {
        const { isValid, message } = await createOrderValidator(req.body);
        if (!isValid) {
            return res.status(400).json({ error: message });
        }

        const order = await orders.createOrder(req.body); // await
        if (!order) {
            return res.status(500).json({ error: "Failed to create order" });
        }

        res.status(201).json({ message: "Order created successfully!", order });
    } catch (error) {
        console.error("Controller Error in createOrder:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

/*
 * This function updates order's details, returns 204 status if successful,
 * 404 error if order not found, 400 error if the data is invalid.
 */
const updateOrder = async (req, res) => { // async
    try {
        const { isValid, message } = await updateOrderValidator(req.body);
        if (!isValid) {
            return res.status(400).json({ error: message });
        }

        const id = req.params.id;
        const order = await orders.updateOrder(id, req.body); // await
        if (!order) {
            return res.status(404).json({ error: "Order not found" });
        }

        res.status(204).send();
    } catch (error) {
        console.error("Controller Error in updateOrder:", error);
        if (error.name === "CastError") {
            return res.status(400).json({ error: "Invalid Order ID format" });
        }
        res.status(500).json({ error: "Internal Server Error" });
    }
};

/*
 * This function deletes the order with given id, returns 204 status if successful, 404 if order not found
 */
const deleteOrder = async (req, res) => { // async
    try {
        const id = req.params.id;
        const order = await orders.deleteOrder(id); // await
        if (!order) {
            return res.status(404).json({ error: "Order not found" });
        }

        res.status(204).send();
    } catch (error) {
        console.error("Controller Error in deleteOrder:", error);
        if (error.name === "CastError") {
            return res.status(400).json({ error: "Invalid Order ID format" });
        }
        res.status(500).json({ error: "Internal Server Error" });
    }
};

module.exports = {
    getAllOrders,
    getOrderById,
    createOrder,
    updateOrder,
    deleteOrder,
};