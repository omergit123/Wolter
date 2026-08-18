import React from "react";
import "./MainPage.css";
import CategoriesButtons from "./CategoriesButtons";
import NearbyRestaurants from "./NearbyRestaurants";
import SearchBar from "../SearchBar/SearchBar";

// main page component, shows the categories buttons and the nearby restaurants slider
const MainPage = () => {
    return (
        <div className="main-container">
            <h1>Welcome to the restaurant app!</h1>
            <SearchBar />
            <p>Click on a category to see the restaurants</p>
            <CategoriesButtons />
            <NearbyRestaurants />
        </div>
    );
};

export default MainPage;
