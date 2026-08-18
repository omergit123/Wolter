import React, { useState } from "react";
import RestaurantCreation from "./RestaurantCreation";
import UserOwnedRestaurants from "./UserOwnedRestaurants";
import { useLocation } from "react-router-dom";

const UserStoreDetails = () => {
    const location = useLocation();
    const userData = location.state?.userData || null;
    // trigger to refresh the restaurants list after creating a new restaurant.
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    return (
        <div className="page restaurant-management-page">
            <h1>Here you can create and manage your restaurants</h1>
            <RestaurantCreation
                userRole={userData?.role}
                userData={userData}
                onCreated={() => setRefreshTrigger((prev) => prev + 1)}
            />
            <UserOwnedRestaurants
                userRole={userData?.role}
                refreshTrigger={refreshTrigger}
            />
        </div>
    );
};

export default UserStoreDetails;
