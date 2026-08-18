import React, { useState, useEffect, useCallback } from "react";
import RestaurantCard from "../Cards/RestaurantCard";
import RestaurantEditor from "./RestaurantEditor";
import BaseSlider from "../Slider/BaseSlider";
import { useAuthorization } from "../../context/AuthorizationContext";
import "./UserOwnedRestaurants.css";
import API_URL from "../../config";

const UserOwnedRestaurants = ({ userRole, refreshTrigger }) => {
    const [restaurants, setRestaurants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showEditor, setShowEditor] = useState(false);
    const [selectedRestaurantId, setSelectedRestaurantId] = useState(null);
    const { token, userId } = useAuthorization();

    const isRestaurantOwner = userRole === "restaurantOwner";

    const fetchUserRestaurants = useCallback(async () => {
        if (!token || !userId || userId === "null") return;

        try {
            setLoading(true);
            const response = await fetch(
                `${API_URL}/restaurants/userOwner/${userId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            );
            if (!response.ok) {
                throw new Error("Failed to fetch restaurants");
            }
            const data = await response.json();
            setRestaurants(data);
        } catch (err) {
            setError(err.message);
            console.error("Error fetching user restaurants:", err);
        } finally {
            setLoading(false);
        }
    }, [userId, token]);

    useEffect(() => {
        if (isRestaurantOwner) {
            fetchUserRestaurants();
        }
    }, [isRestaurantOwner, refreshTrigger, fetchUserRestaurants]);

    const handleEditClick = (restaurantId) => {
        setSelectedRestaurantId(restaurantId);
        setShowEditor(true);
    };

    const handleDeleteRestaurant = async (restaurantId) => {
        if (
            !window.confirm(
                "Are you sure you want to delete this restaurant? This will remove all its products.",
            )
        )
            return;
        try {
            const response = await fetch(
                `${API_URL}/restaurants/${restaurantId}`,
                {
                    method: "DELETE",
                    headers: {
                        authorization: `Bearer ${token}`,
                    },
                },
            );
            if (!response.ok) throw new Error("Failed to delete restaurant");
            alert("Restaurant deleted successfully!");
            fetchUserRestaurants();
        } catch (err) {
            alert(err.message);
        }
    };

    if (!isRestaurantOwner) return null;
    if (loading)
        return (
            <div className="user-restaurants">Loading your restaurants...</div>
        );
    if (error)
        return (
            <div className="user-restaurants" style={{ color: "red" }}>
                ⚠️ {error}
            </div>
        );

    if (showEditor && selectedRestaurantId) {
        return (
            <RestaurantEditor
                restaurantId={selectedRestaurantId}
                onBack={() => {
                    setShowEditor(false);
                    setSelectedRestaurantId(null);
                    fetchUserRestaurants();
                }}
                onSave={() => {
                    fetchUserRestaurants();
                }}
            />
        );
    }

    if (restaurants.length === 0) {
        return (
            <div className="no-restaurants">
                You don't own any restaurants yet.
            </div>
        );
    }

    return (
        <BaseSlider title="My Restaurants">
            {restaurants.map((restaurant) => (
                <div
                    className="restaurant-item-wrapper"
                    key={restaurant.id || restaurant._id}
                >
                    <RestaurantCard restaurant={restaurant} />
                    <div className="restaurant-actions">
                        <button
                            className="btn-edit"
                            onClick={() =>
                                handleEditClick(restaurant.id || restaurant._id)
                            }
                            title="Edit restaurant and products"
                        >
                            ✏️ Edit
                        </button>
                        <button
                            className="btn-delete"
                            onClick={() =>
                                handleDeleteRestaurant(
                                    restaurant.id || restaurant._id,
                                )
                            }
                            title="Delete restaurant"
                        >
                            🗑️ Delete
                        </button>
                    </div>
                </div>
            ))}
        </BaseSlider>
    );
};

export default UserOwnedRestaurants;
