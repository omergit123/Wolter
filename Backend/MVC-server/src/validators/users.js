const postUserValidator = (userData) => {
    if (typeof userData !== "object" || userData === null || Array.isArray(userData)) {
        return { isValid: false, message: "Data must be a valid object" };
    }

    const { name, age, location, username, password, phoneNumber, role } = userData;

    if ([name, age, location, username, password, phoneNumber].some((f) => f === undefined || f === null || f === "")) {
        return {
            isValid: false,
            message: "Missing required fields. The format is name, age, location, username, password, phoneNumber.",
        };
    }

    const allowedRoles = ["regular", "restaurantOwner"];
    if (!role || !allowedRoles.includes(role)) {
        return {
            isValid: false,
            message: "Role must be either 'regular' or 'restaurantOwner'",
        };
    }

    const nameRegex = /^[A-Za-z\s'-]{2,50}$/;
    const usernameRegex = /^[A-Za-z0-9_]{3,20}$/;
    const phoneRegex = /^\+?[0-9]{7,15}$/;
    const passwordRegex = /^.{4,20}$/;

    let parsedLocation = location;
    if (typeof location === "string") {
        try {
            parsedLocation = JSON.parse(location);
        } catch (e) {
            return { isValid: false, message: "Location is not a valid JSON object" };
        }
    }

    if (parsedLocation && typeof parsedLocation === "object" && !Array.isArray(parsedLocation)) {
        const lat = Number(parsedLocation.lat);
        const lon = Number(parsedLocation.lon);

        if (parsedLocation.lat === "" || parsedLocation.lon === "" || parsedLocation.lat === undefined || parsedLocation.lon === undefined || isNaN(lat) || isNaN(lon)) {
            return {
                isValid: false,
                message: "Location must be an object with numeric lat and lon properties",
            };
        }

        if (lat < -90 || lat > 90 || lon < -180 || lon > 180) {
            return {
                isValid: false,
                message: "Latitude must be between -90 and 90, and longitude between -180 and 180",
            };
        }
    } else {
        return {
            isValid: false,
            message: "Location is required and must be a valid object",
        };
    }

    if (!nameRegex.test(name.trim())) {
        return { isValid: false, message: "Name must be 2-50 characters\n" };
    }

    if (!usernameRegex.test(username)) {
        return { isValid: false, message: "Username must be 3-20 characters, letters, numbers, and underscores only\n" };
    }

    if (!phoneRegex.test(phoneNumber)) {
        return { isValid: false, message: "Phone number must be 7-15 digits, optional leading +\n" };
    }

    if (!passwordRegex.test(password)) {
        return { isValid: false, message: "Password must be 4-20 characters, numbers or symbols\n" };
    }

    const ageNum = Number(age);
    if (!Number.isInteger(ageNum) || ageNum < 0 || ageNum > 130) {
        return { isValid: false, message: "Valid age: 0-130 years\n" };
    }

    return { isValid: true, message: "User data is valid." };
};

module.exports = { postUserValidator };