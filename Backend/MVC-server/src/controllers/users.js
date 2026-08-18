const userService = require("../services/users");
const { postUserValidator } = require("../validators/users");

const getUserDetails = async (req, res) => {
    try {
        const id = req.params.id;
        const userDetails = await userService.getUserDetails(id);
        if (!userDetails) {
            return res.status(404).json({ error: "User not found." });
        }
        res.json(userDetails);
    } catch (error) {
        res.status(500).json({ error: "Internal server error." });
    }
};

const createUser = async (req, res) => {
    try {
        const { isValid, message } = postUserValidator(req.body);
        if (!isValid) {
            return res.status(400).json({ error: message });
        }

        if (!req.file) {
            return res.status(400).json({ error: "Image required" });
        }

        const result = await userService.createUser(req.body, req.file);

        if (!result.isValid) {
            switch (result.error) {
                case "USERNAME_EXISTS":
                    return res.status(409).json({ error: "Username already taken." });
                case "CREATE_FAILED":
                    return res.status(500).json({ error: "User creation process failed." });
                default:
                    return res.status(500).json({ error: "An unknown error occurred." });
            }
        }

        res.status(201).json(result.user);
    } catch (error) {
        res.status(500).json({ error: "Internal server error." });
    }
};

module.exports = {
    getUserDetails,
    createUser
};