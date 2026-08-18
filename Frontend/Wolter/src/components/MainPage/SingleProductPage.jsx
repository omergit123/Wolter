import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuthorization } from "../../context/AuthorizationContext";
import ProductCard from "../Cards/ProductCard";
import API_URL from "../../config";

const SingleProductPage = () => {
    const { productId, restaurantId } = useParams();

    const { token } = useAuthorization();
    const navigate = useNavigate();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        setLoading(true);
        setError(null);

        fetch(`${API_URL}/restaurants/${restaurantId}/products/${productId}`, {
            headers: {
                "Content-Type": "application/json",
                authorization: `Bearer ${token}`,
            },
        })
            .then((res) => {
                if (!res.ok) {
                    throw new Error(
                        `Error: ${res.status}. Could not fetch product.`,
                    );
                }
                return res.json();
            })
            .then((data) => {
                setProduct(data);
            })
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, [productId, restaurantId, token]);

    return (
        <div className="page">
            <button className="backButton" onClick={() => navigate(-1)}>
                Back
            </button>

            {loading && <p>Loading product details...</p>}
            {error && <p style={{ color: "red" }}>⚠️ {error}</p>}

            {!loading &&
                !error &&
                (product ? (
                    <div className="list">
                        <ProductCard product={product} />
                    </div>
                ) : (
                    <div className="not-found-message">
                        <p>Product not found 😕</p>
                    </div>
                ))}
        </div>
    );
};

export default SingleProductPage;
