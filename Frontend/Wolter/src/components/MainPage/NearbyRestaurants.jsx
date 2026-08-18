import React, { useState, useEffect } from "react";
import BaseSlider from "../Slider/BaseSlider";
import RestaurantCard from "../Cards/RestaurantCard";
import { useAuthorization } from "../../context/AuthorizationContext";
import API_URL from "../../config";

// component for the nearby restaurants slider, shows the nearby restaurants in a slider on the main page
const NearbyRestaurants = () => {
    const [restaurants, setRestaurants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { token } = useAuthorization();

    useEffect(() => {
        if (!token) return;

        setLoading(true);
        setError(null);

        fetch(`${API_URL}/restaurants/nearbyRestaurants`, {
            headers: {
                authorization: `Bearer ${token}`,
            },
        })
            .then((res) => {
                if (!res.ok) throw new Error(`error: ${res.status}`);
                return res.json();
            })
            .then((data) => {
                setRestaurants(data);
            })
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, [token]);

    if (loading) {
        return <p>Loading nearby restaurants...</p>;
    }

    if (error) {
        return <p>Error loading nearby restaurants: {error}</p>;
    }

    return (
        <BaseSlider title="Nearby Restaurants">
            {restaurants.map((restaurant) => (
                <RestaurantCard key={restaurant.id || restaurant._id} restaurant={restaurant} />
            ))}
        </BaseSlider>
    );
};

export default NearbyRestaurants;
