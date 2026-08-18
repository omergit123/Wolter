/*
 * Validator function helper for posting and updating restaurant data.
 */
const postAndUpdateRestaurantValidator = (data) => {
    const allowedFields = [
        "name",
        "location",
        "phoneNumber",
        "description",
        "category",
        "userOwner",
    ];

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

    const { phoneNumber, location } = data;

    const phoneRegex = /^\d+$/;
    if (
        phoneNumber &&
        (typeof phoneNumber !== "string" || !phoneRegex.test(phoneNumber))
    ) {
        return {
            isValid: false,
            message: "Phone number must contain digits only",
        };
    }

    // check valid location
    if (location && typeof location === "object" && !Array.isArray(location)) {
        const lat = Number(location.lat);
        const lon = Number(location.lon);

        if (
            location.lat === "" ||
            location.lon === "" ||
            location.lat === undefined ||
            location.lon === undefined ||
            isNaN(lat) ||
            isNaN(lon)
        ) {
            return {
                isValid: false,
                message:
                    "Location must be an object with numeric lat and lon properties",
            };
        }

        if (lat < -90 || lat > 90 || lon < -180 || lon > 180) {
            return {
                isValid: false,
                message:
                    "Latitude must be between -90 and 90, and longitude between -180 and 180",
            };
        }
    } else {
        return {
            isValid: false,
            message: "Location is required and must be a valid object",
        };
    }

    return { isValid: true, message: "Data is temporarily valid" };
};

// Validator function for posting restaurant data, checks that all required fields are present and valid
const postRestaurantValidator = (data) => {
    const { isValid, message } = postAndUpdateRestaurantValidator(data);
    if (!isValid) {
        return { isValid: false, message };
    }

    const { name, location, phoneNumber, description, category, userOwner } =
        data;
    if (
        !name ||
        !location ||
        !phoneNumber ||
        !description ||
        !category ||
        !userOwner
    ) {
        return {
            isValid: false,
            message:
                "Missing required fields. The format is: name, location, phoneNumber, description, category, userOwner",
        };
    }

    if (typeof userOwner !== "string") {
        return {
            isValid: false,
            message: "userOwner must be a string (user ID)",
        };
    }

    return { isValid: true, message: "Data is valid" };
};

// Validator function for updating restaurant data, checks that all required fields are present and valid
const updateRestaurantValidator = (data) => {
    const { isValid, message } = postAndUpdateRestaurantValidator(data);
    if (!isValid) {
        return { isValid: false, message };
    }

    return { isValid: true, message: "Data is valid" };
};

module.exports = {
    postRestaurantValidator,
    updateRestaurantValidator,
};
