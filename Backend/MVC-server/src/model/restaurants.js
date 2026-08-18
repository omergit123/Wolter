const mongoose = require("mongoose");

// Restaurant schema definition
const restaurantSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        category: { type: String, required: true },
        description: { type: String, required: true },

        location: {
            lat: { type: Number, required: true },
            lon: { type: Number, required: true },
        },

        phoneNumber: { type: String, required: true },

        userOwner: { type: String, required: true },
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

module.exports =
    mongoose.models.Restaurant ||
    mongoose.model("Restaurant", restaurantSchema);