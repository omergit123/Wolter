const path = require("path");
const express = require("express");
const app = express();
const multer = require("multer");
const cors = require("cors");

const mongoose = require("mongoose");

mongoose.connect("mongodb://mongodb:27017/orders_db")
    .then(() => console.log("Connected to MongoDB inside Docker!"))
    .catch(err => console.error(err));

const restaurants = require("./routes/restaurants");
const search = require("./routes/search");
const orders = require("./routes/orders");
const users = require("./routes/users");
const tokens = require("./routes/tokens");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});
app.use(cors());

app.use("/uploads", express.static(path.resolve(__dirname, "..", "uploads")));

app.use("/api/restaurants", restaurants);
app.use("/api/search", search);
app.use("/api/orders", orders);
app.use("/api/users", users);
app.use("/api/tokens", tokens);

app.listen(3000, '0.0.0.0', () => {
    console.log("Server is running on port 3000 and listening to all network interfaces!");
});
