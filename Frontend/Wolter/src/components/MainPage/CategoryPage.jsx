import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuthorization } from "../../context/AuthorizationContext";
import "./CategoryPage.css";
import RestaurantCard from "../Cards/RestaurantCard";
import API_URL from "../../config";

// func for category page, shows all restaurants in the relevant category
const CategoryPage = () => {
    // url examples: /category/italian -> type = "italian", /restaurants -> type is undefined
    const { type } = useParams();
    const { token } = useAuthorization();
    const navigate = useNavigate();
    const [restaurants, setRestaurants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!token) return;

        setLoading(true);
        setError(null);

        const endpoint = type
            ? `${API_URL}/restaurants/category/${type}`
            : `${API_URL}/restaurants`;

        fetch(endpoint, {
            headers: {
                "Content-Type": "application/json",
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
    }, [type, token]);

    return (
        <div className="page">
            <button className="backButton" onClick={() => navigate(-1)}>
                Back
            </button>

            <h2>
                {type
                    ? `restaurants in category: ${type}, click on any to view products`
                    : "all restaurants, click on any to view products"}
            </h2>

            {loading && <p>Loading restaurants...</p>}
            {error && <p style={{ color: "red" }}>⚠️ {error}</p>}

            <div className="list">
                {!loading &&
                    !error &&
                    (restaurants.length > 0 ? (
                        restaurants.map((r) => (
                            <RestaurantCard key={r.id || r._id} restaurant={r} />
                        ))
                    ) : (
                        <div className="not-found-message">
                            <p>No restaurants found in this category 😕</p>
                        </div>
                    ))}
            </div>
        </div>
    );
};

export default CategoryPage;
