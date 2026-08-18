const users = require("../services/users");
const { tokensValidator } = require("../validators/tokens");
const jwt = require("jsonwebtoken");
const { JWT_SECRET_KEY } = require("../config/jwt");

const login = async (req, res) => {
    const { isValid, message } = tokensValidator(req.body);
    if (!isValid) {
        return res.status(400).json({ error: message });
    }

    const { username, password } = req.body;

    const userId = await users.loginValidator(username, password);
    if (!userId) {
        return res.status(401).json({ error: "Invalid username or password" });
    }

    const token = jwt.sign({ userId: userId.toString(), username }, JWT_SECRET_KEY);

    return res.json({
        token,
    });
};

module.exports = {
    login,
};