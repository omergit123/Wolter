import React, { useState, useEffect } from "react";
import "./ProductModal.css";
import AmountSelector from "./AmountSelector";
import { useCart } from "../../context/CartContext";
import { useAuthorization } from "../../context/AuthorizationContext";
import API_URL from "../../config";

const ProductModal = ({
    product,
    restaurantId,
    onClose,
    onSelectProduct,
}) => {
    const { addItem } = useCart();
    const { token } = useAuthorization();

    const [currentProduct, setCurrentProduct] = useState(product);
    const [amount, setAmount] = useState(1);
    const [recommendations, setRecommendations] = useState([]);
    const [loadingRecs, setLoadingRecs] = useState(false);
    const [addedNotice, setAddedNotice] = useState("");

    // Update currentProduct if product prop changes
    useEffect(() => {
        setCurrentProduct(product);
        setAmount(1);
        setAddedNotice("");
    }, [product]);

    const activeProductId =
        currentProduct?.id || currentProduct?._id || currentProduct?.productId;
    const activeRestaurantId =
        restaurantId || currentProduct?.restaurantId;

    // Close on Escape key press
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Escape") {
                onClose();
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [onClose]);

    // Prevent background scrolling while modal is open
    useEffect(() => {
        const prevOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = prevOverflow;
        };
    }, []);

    // Fetch recommendations for currentProduct
    useEffect(() => {
        if (!activeProductId || !activeRestaurantId || !token) {
            setRecommendations([]);
            return;
        }

        let isMounted = true;
        setLoadingRecs(true);
        setRecommendations([]);

        // Primary: http GET request to api/:restaurantId/recommendations/:productId
        const primaryUrl = `${API_URL}/${activeRestaurantId}/recommendations/${activeProductId}`;

        const fetchRecommendations = async () => {
            let recData = null;
            try {
                const res = await fetch(primaryUrl, {
                    headers: {
                        "Content-Type": "application/json",
                        authorization: `Bearer ${token}`,
                    },
                });

                if (res.ok) {
                    recData = await res.json();
                }
            } catch (err) {
                console.warn("Could not fetch recommendations:", err);
            }

            if (!isMounted) return;

            if (!recData || !Array.isArray(recData) || recData.length === 0) {
                setRecommendations([]);
                setLoadingRecs(false);
                return;
            }

            // If recData is already an array of full product objects
            if (
                typeof recData[0] === "object" &&
                recData[0] !== null &&
                recData[0].name
            ) {
                setRecommendations(
                    recData.filter(
                        (p) =>
                            String(p.id || p._id || p.productId) !== String(activeProductId)
                    )
                );
                setLoadingRecs(false);
                return;
            }

            // Otherwise, recData is an array of product IDs
            const recIds = recData
                .filter((id) => String(id) !== String(activeProductId))
                .slice(0, 10);

            if (recIds.length === 0) {
                setRecommendations([]);
                setLoadingRecs(false);
                return;
            }

            try {
                const productPromises = recIds.map(async (id) => {
                    try {
                        const r1 = await fetch(
                            `${API_URL}/restaurants/${activeRestaurantId}/products/${id}`,
                            {
                                headers: {
                                    "Content-Type": "application/json",
                                    authorization: `Bearer ${token}`,
                                },
                            }
                        );
                        if (r1.ok) return await r1.json();
                    } catch (e) {
                        return null;
                    }
                    return null;
                });

                const productsData = await Promise.all(productPromises);
                if (isMounted) {
                    setRecommendations(productsData.filter(Boolean));
                }
            } catch (err) {
                console.error("Error fetching recommendation product details:", err);
                if (isMounted) setRecommendations([]);
            } finally {
                if (isMounted) setLoadingRecs(false);
            }
        };

        fetchRecommendations();

        return () => {
            isMounted = false;
        };
    }, [activeProductId, activeRestaurantId, token]);

    const handleQuantityChange = (delta) => {
        setAmount((prev) => Math.max(1, prev + delta));
    };

    const handleAddToCart = () => {
        if (!currentProduct) return;

        const itemToAdd = {
            productId: activeProductId,
            name: currentProduct.name,
            price: Number(currentProduct.price),
            restaurantId: activeRestaurantId,
            ingredients: currentProduct.ingredients,
            description: currentProduct.description,
        };

        addItem(itemToAdd, amount);
        setAddedNotice(`Added ${amount} × "${currentProduct.name}" to cart! 🛒`);
        setTimeout(() => setAddedNotice(""), 3500);
    };

    const handleAddRecommended = (recProduct, e) => {
        e.stopPropagation();
        const recId = recProduct.id || recProduct._id || recProduct.productId;
        const itemToAdd = {
            productId: recId,
            name: recProduct.name,
            price: Number(recProduct.price),
            restaurantId: recProduct.restaurantId || activeRestaurantId,
            ingredients: recProduct.ingredients,
            description: recProduct.description,
        };

        addItem(itemToAdd, 1);
        setAddedNotice(`Added "${recProduct.name}" to cart! 🛒`);
        setTimeout(() => setAddedNotice(""), 3500);
    };

    const handleSwitchProduct = (recProduct) => {
        setCurrentProduct(recProduct);
        setAmount(1);
        setAddedNotice("");
        if (onSelectProduct) {
            onSelectProduct(recProduct);
        }
    };

    if (!currentProduct) return null;

    const formattedIngredients = Array.isArray(currentProduct.ingredients)
        ? currentProduct.ingredients
        : currentProduct.ingredients
        ? currentProduct.ingredients.split(",").map((s) => s.trim())
        : [];

    const totalPrice = (Number(currentProduct.price) * amount).toFixed(2);

    return (
        <div className="product-modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
            <div
                className="product-modal-container"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close Button */}
                <button
                    className="modal-close-btn"
                    onClick={onClose}
                    aria-label="Close modal"
                    type="button"
                >
                    &times;
                </button>

                {/* Header */}
                <div className="modal-header">
                    <div className="modal-title-group">
                        <h2 className="modal-title">{currentProduct.name}</h2>
                        <span className="modal-price-badge">${currentProduct.price}</span>
                    </div>
                </div>

                {/* Details Section */}
                <div className="modal-details-section">
                    {currentProduct.description && (
                        <p className="modal-description">{currentProduct.description}</p>
                    )}

                    {formattedIngredients.length > 0 && (
                        <div className="modal-ingredients-wrapper">
                            <span className="modal-section-subtitle">Ingredients:</span>
                            <div className="ingredients-tags">
                                {formattedIngredients.map((ing, idx) => (
                                    <span key={idx} className="ingredient-tag">
                                        {ing}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Alert Toast Notification */}
                {addedNotice && (
                    <div className="modal-added-banner">
                        <span>{addedNotice}</span>
                    </div>
                )}

                {/* Add to Cart Section */}
                <div className="modal-cart-section">
                    <div className="modal-cart-controls">
                        <div className="amount-label-wrapper">
                            <span className="amount-label">Quantity</span>
                            <AmountSelector
                                amount={amount}
                                onIncrease={() => handleQuantityChange(1)}
                                onDecrease={() => handleQuantityChange(-1)}
                                onAmountChange={(val) => setAmount(Math.max(1, val))}
                            />
                        </div>

                        <div className="modal-total-display">
                            <span className="total-label">Subtotal</span>
                            <span className="total-value">${totalPrice}</span>
                        </div>
                    </div>

                    <button
                        type="button"
                        className="btn btn-primary modal-add-cart-btn"
                        onClick={handleAddToCart}
                    >
                        <span>Add to Cart 🛒</span>
                        <span className="btn-price-inline">${totalPrice}</span>
                    </button>
                </div>

                {/* Recommendations Section */}
                <div className="modal-recommendations-section">
                    <div className="modal-recs-header">
                        <span className="modal-recs-title">
                            ✨ Recommended with this item
                        </span>
                        {recommendations.length > 0 && (
                            <span className="modal-recs-count">
                                {recommendations.length} available
                            </span>
                        )}
                    </div>

                    {loadingRecs && (
                        <div className="recs-loading-box">
                            <div className="recs-spinner"></div>
                            <span>Finding recommendations for you...</span>
                        </div>
                    )}

                    {!loadingRecs && recommendations.length === 0 && (
                        <p className="recs-empty-text">
                            No specific recommendations for this item right now.
                        </p>
                    )}

                    {!loadingRecs && recommendations.length > 0 && (
                        <div className="recs-grid">
                            {recommendations.map((rec) => {
                                const recId =
                                    rec.id || rec._id || rec.productId;
                                return (
                                    <div
                                        key={recId}
                                        className="rec-mini-card"
                                        onClick={() => handleSwitchProduct(rec)}
                                        title="Click to view details"
                                    >
                                        <div className="rec-mini-header">
                                            <h4 className="rec-mini-title">
                                                {rec.name}
                                            </h4>
                                            <span className="rec-mini-price">
                                                ${rec.price}
                                            </span>
                                        </div>

                                        {rec.description && (
                                            <p className="rec-mini-desc">
                                                {rec.description}
                                            </p>
                                        )}

                                        <div className="rec-mini-actions">
                                            <button
                                                type="button"
                                                className="rec-add-btn"
                                                onClick={(e) =>
                                                    handleAddRecommended(rec, e)
                                                }
                                                title="Add directly to cart"
                                            >
                                                + Add
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductModal;
