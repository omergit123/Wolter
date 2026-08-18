const jwt = require("jsonwebtoken");

const { JWT_SECRET_KEY } = require("../config/jwt");

const auth = (req, res, next) => {
    const authHeader = req.headers.authorization;

    // check if token is provided
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Missing token" });
    }

    // extract token from header
    const token = authHeader.split(" ")[1];

    // verify token
    try {
        const decoded = jwt.verify(token, JWT_SECRET_KEY);

        req.user = {
            userId: decoded.userId,
            username: decoded.username
        };

        next();
    } catch (err) {
        return res.status(401).json({ error: "Invalid or expired token" });
    }
};

module.exports = auth;