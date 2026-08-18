const express = require("express");
var router = express.Router();
const auth = require("../middleware/auth");
const upload = require("../middleware/multer.js");
const { checkUserExists } = require("../middleware/userCheckMiddleware");
// users controller handles user-related actions
const users = require("../controllers/users.js");
router.get("/:id", auth, checkUserExists, users.getUserDetails);
router.post("/", upload.single("profileImage"), users.createUser);

module.exports = router;
