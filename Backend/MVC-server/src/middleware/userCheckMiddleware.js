const users = require("../services/users");

/*
 * Middleware function to check if user that is connected exists before allowing access to routes.
 * Assumes that auth middleware has already run and set req.user with the authenticated user's information.
 */
const checkUserExists = async (req, res, next) => {
    const userId = req.user.userId;
    const user = await users.getUserDetails(userId);

    if (!user) {
        return res.status(404).json({ error: "Connected user was not found" });
    }

    next();
};

module.exports = { checkUserExists };
