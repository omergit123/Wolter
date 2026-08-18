/*
 * Validator function helper for posting and updating product data.
 */
const postAndUpdateProductValidator = (data) => {
    // id and restaurantId are given in the post and update functions, so we don't check them here
    const allowedFields = ["name", "price", "ingredients", "description"];

    if (
        typeof data !== "object" ||
        data === null ||
        data == undefined ||
        Array.isArray(data)
    ) {
        return { isValid: false, message: "Data must be a valid object" };
    }

    const dataKeys = Object.keys(data);

    const hasExtraFields = dataKeys.some((key) => !allowedFields.includes(key));
    if (hasExtraFields) {
        return { isValid: false, message: "Data contains extra fields" };
    }

    const { price, ingredients } = data;

    // Matches a number with two decimal places (e.g., 10.99)
    const priceRegex = /^\d+\.\d{2}$/;
    if (price && (typeof price !== "string" || !priceRegex.test(price))) {
        return {
            isValid: false,
            message: "Price must be a valid number with two decimal places",
        };
    }

    if (
        ingredients &&
        (!Array.isArray(ingredients) ||
            !ingredients.every((item) => typeof item === "string"))
    ) {
        return {
            isValid: false,
            message: "Ingredients must be an array of strings",
        };
    }

    return { isValid: true, message: "Data is temporarily valid" };
};

// Validator function for posting product data, checks that all required fields are present and valid
const postProductValidator = (data) => {
    const { isValid, message } = postAndUpdateProductValidator(data);
    if (!isValid) {
        return { isValid: false, message };
    }

    const { name, price, ingredients, description } = data;
    if (!name || !price || !ingredients || !description) {
        return {
            isValid: false,
            message:
                "Missing required fields. The format is: name, price, ingredients, description",
        };
    }

    return { isValid: true, message: "Data is valid" };
};

// Validator function for updating product data, checks that all required fields are present and valid
const updateProductValidator = (data) => {
    const { isValid, message } = postAndUpdateProductValidator(data);
    if (!isValid) {
        return { isValid: false, message };
    }

    return { isValid: true, message: "Data is valid" };
};

module.exports = {
    postProductValidator,
    updateProductValidator,
};
