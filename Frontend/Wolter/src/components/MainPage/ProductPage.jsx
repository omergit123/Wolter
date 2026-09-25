import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuthorization } from "../../context/AuthorizationContext";
import "./ProductPage.css";
import ProductCard from "../Cards/ProductCard";
import ProductModal from "../Cards/ProductModal";
import API_URL from "../../config";

// func for product page, shows all products of the relevant restaurant
const ProductPage = () => {
    // url example: /category/italian -> restaurantId = "italian"
    const { restaurantId } = useParams();
    const { token } = useAuthorization();
    const navigate = useNavigate();

    const [products, setProducts] = useState([]);
    const [restaurant, setRestaurant] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedProduct, setSelectedProduct] = useState(null);

    useEffect(() => {
        setLoading(true);
        setError(null);

        // Fetch products for restaurant
        const fetchProducts = fetch(`${API_URL}/restaurants/${restaurantId}/products`, {
            headers: {
                "Content-Type": "application/json",
                authorization: `Bearer ${token}`,
            },
        })
            .then((res) => {
                if (!res.ok) {
                    throw new Error(`Error: ${res.status}`);
                }
                return res.json();
            });

        // Fetch restaurant details for header
        const fetchRestaurant = fetch(`${API_URL}/restaurants/${restaurantId}`, {
            headers: {
                "Content-Type": "application/json",
                authorization: `Bearer ${token}`,
            },
        })
            .then((res) => (res.ok ? res.json() : null))
            .catch(() => null);

        Promise.all([fetchProducts, fetchRestaurant])
            .then(([productsData, restaurantData]) => {
                setProducts(productsData || []);
                setRestaurant(restaurantData);
            })
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, [restaurantId, token]);

    return (
        <div className="page product-page-container">
            <div className="product-page-header">
                <button className="backButton" onClick={() => navigate(-1)} type="button">
                    ← Back
                </button>
                <div className="product-page-title-wrap">
                    <h2>{restaurant?.name || "Restaurant Menu"}</h2>
                    {restaurant?.category && (
                        <span className="restaurant-badge">{restaurant.category}</span>
                    )}
                </div>
                {restaurant?.description && (
                    <p className="restaurant-sub-desc">{restaurant.description}</p>
                )}
            </div>

            {loading && (
                <div className="menu-loading-state">
                    <p>Loading restaurant menu...</p>
                </div>
            )}
            {error && <p className="error-message">⚠️ {error}</p>}

            {!loading && !error && (
                <>
                    <div className="menu-meta-bar">
                        <span className="menu-items-count">
                            {products.length} {products.length === 1 ? "item" : "items"} available
                        </span>
                        <span className="menu-hint-text">
                            💡 Click on any card to view details, add to cart & see recommendations
                        </span>
                    </div>

                    <div className="product-grid">
                        {products.length > 0 ? (
                            products.map((p) => (
                                <ProductCard
                                    key={p.id || p._id}
                                    product={p}
                                    restaurantId={restaurantId}
                                    onClick={(clickedProduct) => setSelectedProduct(clickedProduct)}
                                />
                            ))
                        ) : (
                            <div className="not-found-message">
                                <p>No products found for this restaurant 😕</p>
                            </div>
                        )}
                    </div>
                </>
            )}

            {/* Modal Pop-up when a card is clicked */}
            {selectedProduct && (
                <ProductModal
                    product={selectedProduct}
                    restaurantId={restaurantId}
                    onClose={() => setSelectedProduct(null)}
                    onSelectProduct={(newProduct) => setSelectedProduct(newProduct)}
                />
            )}
        </div>
    );
};

export default ProductPage;
