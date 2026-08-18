import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuthorization } from "../../context/AuthorizationContext";
import "./ProductPage.css";
import ProductCard from "../Cards/ProductCard";
import API_URL from "../../config";

// func for product page, shows all products of the relevant restaurant
const ProductPage = () => {
    // url example: /category/italian -> restaurantId = "italian"
    const { restaurantId } = useParams();
    const { token } = useAuthorization();
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        setLoading(true);
        setError(null);

        fetch(`${API_URL}/restaurants/${restaurantId}/products`, {
            headers: {
                "Content-Type": "application/json",
                authorization: `Bearer ${token}`,
            },
        })
            .then((res) => {
                if (!res.ok) {
                    throw new Error(`error: ${res.status}, ${res.error}`);
                }
                return res.json();
            })
            .then((data) => {
                setProducts(data);
            })
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, [restaurantId, token]);

    return (
        <div className="page">
            <h2>all products </h2>
            <button className="backButton" onClick={() => navigate(-1)}>
                Back
            </button>

            {loading && <p>Loading products...</p>}
            {error && <p style={{ color: "red" }}>⚠️ {error}</p>}

            <div className="list">
                {!loading &&
                    !error &&
                    (products.length > 0 ? (
                        products.map((p) => (
                            <ProductCard key={p.id || p._id} product={p} />
                        ))
                    ) : (
                        <div className="not-found-message">
                            <p>No products found 😕</p>
                        </div>
                    ))}
            </div>
        </div>
    );
};

export default ProductPage;
