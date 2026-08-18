// init-mongo.js

db = db.getSiblingDB("orders_db");

const targetUserId = "64a40fe8d0e1f2a3b4c5d6e7";

db.users.insertOne({
    _id: ObjectId(targetUserId), // Enforced as a real BSON ObjectId
    name: "Omer Rahamim",
    username: "owner", // 3-20 chars, alphanumeric/underscore
    password: "password123", // 4-20 chars
    age: 23, // Valid age between 0-130
    phoneNumber: "0521234567", // 7-15 digits
    role: "restaurantOwner", // Exactly "restaurantOwner"
    location: {
        lat: 32.0697, // Numeric latitude between -90 and 90
        lon: 34.8732, // Numeric longitude between -180 and 180
    },
});

const restaurantResult = db.restaurants.insertOne({
    name: "Burger and Grill", // Plain English name
    category: "burger",
    description:
        "The best premium burgers in town made from 100 percent fresh ingredients",
    phoneNumber: "031234567", // Digits only according to phoneRegex
    userOwner: targetUserId, // Must be a string (User ID)
    location: {
        lat: 32.0697,
        lon: 34.8732,
    },
});

const generatedRestId = restaurantResult.insertedId.valueOf().toString();

db.products.insertMany([
    {
        name: "Classic Burger",
        price: "55.00", // CRITICAL: Must be a string with exactly two decimal places!
        description:
            "Premium beef patty in a toasted bun with fresh vegetables",
        ingredients: ["Beef", "Lettuce", "Tomato", "Onion", "Pickles"],
        restaurantId: generatedRestId, // Linked to our restaurant
    },
    {
        name: "Crispy Fries",
        price: "22.00", // CRITICAL: Must be a string with exactly two decimal places!
        description: "Golden and crispy potato fries served hot",
        ingredients: ["Potatoes", "Vegetable Oil", "Salt"],
        restaurantId: generatedRestId,
    },
]);
