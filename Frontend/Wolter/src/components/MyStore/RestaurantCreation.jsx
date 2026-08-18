import React, { useState } from "react";
import RestaurantForm from "./RestaurantForm";
import { useAuthorization } from "../../context/AuthorizationContext";
import "./RestaurantCreation.css";
import API_URL from "../../config";

// component for the create restaurant form (using the general restaurant form).
const RestaurantCreation = ({ userRole, userData, onCreated }) => {
    const [isOpen, setIsOpen] = useState(false);
    const { token, userId } = useAuthorization();
    const isRestaurantOwner = userRole === "restaurantOwner";

    // handle submit if data is valid.
    const handleCreateSubmit = async (formDataFromForm) => {
        try {
            const payload = {
                ...formDataFromForm,
                userOwner: userId,
            };

            const response = await fetch(`${API_URL}/restaurants`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                // throw new Error("Failed to create restaurant");
                const errorData = await response.json().catch(() => ({}));
                throw new Error(
                    errorData.message || "Failed to create restaurant",
                );
            }

            alert("Restaurant created successfully! 🎉");
            setIsOpen(false);

            if (onCreated) {
                onCreated();
            }
        } catch (err) {
            console.error("Error:", err);
            alert(err.message);
        }
    };

    if (!isRestaurantOwner) {
        return null;
    }

    return (
        <div className="create-restaurant-form-wrapper">
            <div className="create-restaurant-form-header">
                <h2>Create Restaurant</h2>
                <button
                    className="btn-create-restaurant"
                    onClick={() => setIsOpen((prev) => !prev)}
                >
                    {isOpen ? "Close" : "+ Add Restaurant"}
                </button>
            </div>

            {isOpen && (
                <div className="create-form-container">
                    <RestaurantForm
                        initialData={{ location: userData?.location }}
                        onSubmit={handleCreateSubmit}
                        onCancel={() => setIsOpen(false)}
                        submitLabel="Create Restaurant"
                    />
                </div>
            )}
        </div>
    );
};

export default RestaurantCreation;
