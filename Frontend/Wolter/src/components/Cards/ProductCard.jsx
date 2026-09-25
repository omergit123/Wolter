import React, { useState } from "react";
import { useParams } from "react-router-dom";
import "./ProductCard.css";
import ProductModal from "./ProductModal";

const ProductCard = ({ product, restaurantId: propRestaurantId, onClick, isRecommendation = false }) => {
    const [internalModalOpen, setInternalModalOpen] = useState(false);
    const { restaurantId: paramRestaurantId } = useParams();

    const restaurantId = propRestaurantId || product?.restaurantId || paramRestaurantId;

    const handleCardClick = () => {
        if (onClick) {
            onClick(product);
        } else {
            setInternalModalOpen(true);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleCardClick();
        }
    };

    if (!product) return null;

    const formattedIngredients = Array.isArray(product.ingredients)
        ? product.ingredients.join(", ")
        : product.ingredients || "";

    return (
        <>
            <div
                className={`card product-card ${isRecommendation ? "recommendation-card" : ""}`}
                onClick={handleCardClick}
                onKeyDown={handleKeyDown}
                role="button"
                tabIndex={0}
                aria-label={`View details and add ${product.name} to cart`}
            >
                <div className="product-card-header">
                    <h3>{product.name}</h3>
                    <span className="product-price">${product.price}</span>
                </div>

                <div className="product-card-details">
                    {formattedIngredients && (
                        <p className="product-meta">
                            Ingredients: {formattedIngredients}
                        </p>
                    )}
                    {product.description && (
                        <p className="product-description">{product.description}</p>
                    )}
                </div>

                <div className="product-card-action">
                    <span className="card-click-hint">Customize & Add 🛒</span>
                </div>
            </div>

            {/* If used without an external modal manager, manage modal internally */}
            {internalModalOpen && !onClick && (
                <ProductModal
                    product={product}
                    restaurantId={restaurantId}
                    onClose={() => setInternalModalOpen(false)}
                />
            )}
        </>
    );
};

export default ProductCard;
