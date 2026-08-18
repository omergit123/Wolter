const products = require("../services/products");

/*
 * Validator for create and update order, checks if the data is valid and returns an object with isValid and message properties
 */
const createAndUpdateOrderValidator = (data) => {
    // Check if data is a valid object and not null or undefined or an array
    if (!data || typeof data !== "object" || Array.isArray(data)) {
        return { isValid: false, message: "Data must be a valid object" };
    }

    // Check for extra fields - only productsList, userId are allowed
    const allowedFields = ["productsList", "userId"];
    const dataKeys = Object.keys(data);
    const hasExtraFields = dataKeys.some((key) => !allowedFields.includes(key));
    if (hasExtraFields) {
        return { isValid: false, message: "Data contains extra fields" };
    }

    const { productsList } = data;
    if (productsList !== undefined) {
        // Validate productsList - it should be an array of objects with productId and amount properties
        const isProductsValid = productsValidator(productsList);
        if (!isProductsValid.isValid) {
            return { isValid: false, message: isProductsValid.message };
        }
    }

    // If all validations pass, return true
    return { isValid: true, message: "Data is temporarily valid" };
};

// Validator for products in the order, checks if the product exists in the restaurant
const productsValidator = (productsList) => {
    if (!Array.isArray(productsList)) {
        return { isValid: false, message: "productsList must be an array" };
    }

    if (productsList.length === 0) {
        return {
            isValid: false,
            message: "productsList must contain at least one product",
        };
    }

    for (const pair of productsList) {
        if (!pair || typeof pair !== "object" || Array.isArray(pair)) {
            return {
                isValid: false,
                message: "Each item in productsList must be a valid object",
            };
        }
        // Check if the required fields are present
        if (
            !pair.restaurantAndProduct ||
            !pair.restaurantAndProduct.productId ||
            !pair.restaurantAndProduct.restaurantId ||
            pair.amount === undefined ||
            !Number.isInteger(pair.amount) ||
            pair.amount <= 0
        ) {
            return {
                isValid: false,
                message:
                    "Each product in productsList must have restaurantId, productId and amount",
            };
        }

        // Check if the product exists in the restaurant
        const restaurant = pair.restaurantAndProduct.restaurantId;
        const product = pair.restaurantAndProduct.productId;
        const isValid = products.getProductById(restaurant, product);
        if (!isValid) {
            return {
                isValid: false,
                message: `Product with id ${product} does not exist in restaurant ${restaurant}`,
            };
        }
    }
    // All products are valid, return true
    return { isValid: true, message: "Products are valid" };
};

// Validator for create order, checks if the required fields are present and valid
const createOrderValidator = (data) => {
    const { isValid, message } = createAndUpdateOrderValidator(data);
    if (!isValid) {
        return { isValid: false, message };
    }

    const { productsList, userId } = data;
    // Check for required fields
    if (productsList === undefined || userId === undefined) {
        return {
            isValid: false,
            message:
                "Missing required fields. The format is: productsList, userId",
        };
    }

    return { isValid: true, message: "Data is valid" };
};

// Validator for update order, checks if the data is valid and
// does not contain extra fields, but does not require all fields to be present
const updateOrderValidator = (data) => {
    const { isValid, message } = createAndUpdateOrderValidator(data);
    if (!isValid) {
        return { isValid: false, message };
    }

    // Check if at least one field is provided for update
    if (Object.keys(data).length === 0) {
        return {
            isValid: false,
            message:
                "At least one field (productsList or userId) must be provided for update",
        };
    }

    return { isValid: true, message: "Data is valid" };
};

module.exports = {
    createOrderValidator,
    updateOrderValidator,
};
