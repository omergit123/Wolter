import "./RestaurantCard.css";
import { useNavigate } from "react-router-dom";

// component for the restaurant card, shows the restaurant details and on click navigates to the products page.
const RestaurantCard = ({ restaurant }) => {
    const navigate = useNavigate();

    return (
        <button
            type="button"
            className="card restaurant-card"
            onClick={() => navigate(`/restaurants/${restaurant.id || restaurant._id}/products`)}
        >
            <div className="restaurant-card-header">
                <div>
                    <h3>{restaurant.name}</h3>
                    <span className="restaurant-category">{restaurant.category}</span>
                </div>
            </div>

            {restaurant.description && (
                <p className="restaurant-description">{restaurant.description}</p>
            )}

            <div className="restaurant-card-meta">
                <span>{restaurant.distance !== undefined ? `${restaurant.distance} km` : "Location unknown"}</span>
                <span>{restaurant.phoneNumber || "No phone"}</span>
            </div>
        </button>
    );
};

export default RestaurantCard;
