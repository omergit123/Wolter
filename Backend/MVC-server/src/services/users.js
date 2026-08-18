const path = require("path");
const User = require("../model/users");

const userWithoutPassword = (user) => {
    if (!user) return null;
    const userObj = user.toObject ? user.toObject() : user;
    delete userObj.password;
    return userObj;
};

const getUserDetails = async (id) => {
    return await User.findById(id).select("-password");
};

const getUserByUsername = async (username) => {
    return await User.findOne({ username }).select("-password");
};

const createUser = async (userData, photo) => {
    const existingUser = await User.findOne({ username: userData.username });
    if (existingUser) {
        return { isValid: false, error: "USERNAME_EXISTS" };
    }

    const imagePath = photo
        ? path.posix.join(
              "uploads",
              path.basename(photo.filename || photo.path),
          )
        : null;

    let locObj = userData.location;
    if (typeof locObj === "string") {
        locObj = JSON.parse(locObj);
    }

    const userToCreate = {
        ...userData,
        age: Number(userData.age),
        image: imagePath,
        location: {
            type: "Point",
            coordinates: [Number(locObj.lon), Number(locObj.lat)],
        },
    };

    try {
        const newUser = await User.create(userToCreate);
        return { isValid: true, user: userWithoutPassword(newUser) };
    } catch (error) {
        console.error("Mongoose save error:", error);
        return { isValid: false, error: "CREATE_FAILED" };
    }
};

const loginValidator = async (username, password) => {
    const user = await User.findOne({ username });
    if (!user) {
        return null;
    }
    return user.password === password ? user._id : null;
};

const getAllUsers = async () => {
    return await User.find().select("-password");
};

module.exports = {
    getUserDetails,
    createUser,
    getUserByUsername,
    getAllUsers,
    loginValidator,
};
