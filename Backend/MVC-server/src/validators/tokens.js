const tokensValidator = (data) => {
    const allowedFields = ["username", "password"];

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

    const { username, password } = data;
    if (!username || !password) {
        return {
            isValid: false,
            message:
                "Missing required fields. The format is: username, password",
        };
    }

    return { isValid: true, message: "Token data is valid." };
};

module.exports = {
    tokensValidator,
};
