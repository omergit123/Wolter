const Restaurant = require("../model/restaurants");
const users = require("./users");
const { getDistanceFromLatLonInKm } = require("../utils/distance");

/*
 * Function creates a new restaurant with the given data
 */
const postRestaurant = async (dataToPost) => {
    try {
        const restaurant = new Restaurant(dataToPost);
        return await restaurant.save();
    } catch (error) {
        console.error("Error creating restaurant:", error);
        return null;
    }
};

/*
 * Function gets all restaurants
 */
const getAllRestaurants = async () => {
    try {
        return await Restaurant.find();
    } catch (error) {
        console.error("Error fetching restaurants:", error);
        return null;
    }
};

/*
 * Function gets restaurant by id
 */
const getRestaurantById = async (id) => {
    try {
        return await Restaurant.findById({ _id: id });
    } catch (error) {
        console.error("Error fetching restaurant by id:", error);
        return null;
    }
};

/*
 * Function gets restaurants by category
 */
const getAllRestaurantsByCategory = async (category) => {
    try {
        return await Restaurant.find({ category });
    } catch (error) {
        console.error("Error fetching by category:", error);
        return null;
    }
};

/*
 * Function updates restaurant with the given id
 */
const updateRestaurant = async (id, dataToUpdate) => {
    try {
        return await Restaurant.findByIdAndUpdate({ _id: id }, dataToUpdate, {
            new: true,
        });
    } catch (error) {
        console.error("Error updating restaurant:", error);
        return null;
    }
};

/*
 * Function deletes restaurant with the given id
 */
const deleteRestaurant = async (id) => {
    try {
        return await Restaurant.findByIdAndDelete({ _id: id });
    } catch (error) {
        console.error("Error deleting restaurant:", error);
        return null;
    }
};

/*
 * Function gets restaurants whose name or description contains query
 */
const getRestaurantsByName = async (query) => {
    try {
        const lowerQuery = query.toLowerCase();
        const regex = new RegExp(lowerQuery, "i");

        return await Restaurant.find({
            $or: [{ name: regex }, { description: regex }],
        });
    } catch (error) {
        console.error("Error searching restaurants:", error);
        return null;
    }
};

/*
 * Function gets all restaurants owned by a specific user
 */
const getRestaurantsByUserOwner = async (userId) => {
    try {
        return await Restaurant.find({ userOwner: userId });
    } catch (error) {
        console.error("Error fetching user restaurants:", error);
        return null;
    }
};

/*
 * Function gets nearby restaurants for a user
 * returns sorted by distance
 */
const getNearbyRestaurants = async (connectedUserId) => {
    try {
        const userDetails = await users.getUserDetails(connectedUserId);

        let userLat = null;
        let userLon = null;

        if (
            userDetails &&
            userDetails.location &&
            Array.isArray(userDetails.location.coordinates) &&
            userDetails.location.coordinates.length >= 2
        ) {
            userLon = Number(userDetails.location.coordinates[0]);
            userLat = Number(userDetails.location.coordinates[1]);
        }

        const restaurants = await Restaurant.find();

        const withDistance = restaurants.map((r) => {
            const restaurantObj = r.toObject();

            if (
                userLat === null ||
                userLon === null ||
                !restaurantObj.location ||
                restaurantObj.location.lat === undefined ||
                restaurantObj.location.lon === undefined
            ) {
                return {
                    ...restaurantObj,
                    distance: null,
                };
            }

            const distance = getDistanceFromLatLonInKm(
                userLat,
                userLon,
                Number(restaurantObj.location.lat),
                Number(restaurantObj.location.lon),
            );

            const formattedDistance = isNaN(distance)
                ? null
                : parseFloat(distance.toFixed(1));

            return {
                ...restaurantObj,
                distance: formattedDistance,
            };
        });

        return withDistance.sort((a, b) => {
            if (a.distance === null && b.distance === null) return 0;
            if (a.distance === null) return 1;
            if (b.distance === null) return -1;
            return a.distance - b.distance;
        });
    } catch (error) {
        console.error("Error fetching nearby restaurants:", error);
        return null;
    }
};

module.exports = {
    getAllRestaurants,
    getRestaurantById,
    getAllRestaurantsByCategory,
    postRestaurant,
    updateRestaurant,
    deleteRestaurant,
    getRestaurantsByName,
    getRestaurantsByUserOwner,
    getNearbyRestaurants,
};
