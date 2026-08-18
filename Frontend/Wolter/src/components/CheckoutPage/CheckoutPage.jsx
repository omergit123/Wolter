import React, { useState } from "react";
import { useCart } from "../../context/CartContext"; // Adjust path if needed
import "./CheckoutPage.css";
import API_URL from "../../config";
import { useAuthorization } from "../../context/AuthorizationContext.js";

function CheckoutPage() {
    const { userId, token } = useAuthorization();
    const { cart, addItem, removeItem, removeProduct, clearCart, totalPrice } =
        useCart();

    // Local state to manage UI loading and errors during the server request
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmitOrder = async () => {
        setLoading(true);
        setError(null);

        if (!token) {
            setError("You must be logged in to place an order.");
            setLoading(false);
            return;
        }

        // 2. Map your local context cart format into the backend's strict body structure
        const formattedProductsList = cart.map((item) => ({
            restaurantAndProduct: {
                restaurantId: item.restaurantId,
                productId: item.productId,
            },
            amount: item.amount,
        }));

        // 3. Assemble the explicit payload object requested by your server routing
        const payload = {
            productsList: formattedProductsList,
            userId: userId, // Your specified target userId string
        };

        try {
            // Adjust port routing to match your Express server instantiation (e.g., 5000)
            const response = await fetch(API_URL + "/orders", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(payload), // Injecting the specific structural design
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.error ||
                        data.message ||
                        "Something went wrong while submitting your order.",
                );
            }

            // Success pipeline
            alert("Order submitted successfully to the server! 🚀");
            clearCart(); // Clean context state variables and storage partitions
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (cart.length === 0) {
        return (
            <div className="checkout-empty-container">
                <h2>Your cart is empty 🛒</h2>
                <p>Go back to the menu to add some delicious food!</p>
            </div>
        );
    }

    return (
        <div className="checkout-main-wrapper">
            <h2 className="checkout-title">Order Summary 📋</h2>

            {/* Error Message Indicator */}
            {error && <div className="checkout-error-banner">⚠️ {error}</div>}

            <div className="checkout-items-list">
                {cart.map((item) => (
                    <div key={item.productId} className="checkout-item-row">
                        <div className="checkout-item-details">
                            <strong className="checkout-item-name">
                                {item.name}
                            </strong>
                            <div className="checkout-item-unit-price">
                                {item.price} $ each
                            </div>
                        </div>

                        <div className="checkout-quantity-controls">
                            <button
                                className="checkout-qty-btn"
                                onClick={() => removeItem(item.productId)}
                            >
                                -
                            </button>
                            <span className="checkout-qty-display">
                                {item.amount}
                            </span>
                            <button
                                className="checkout-qty-btn"
                                onClick={() => addItem(item, 1)}
                            >
                                +
                            </button>
                        </div>

                        <div className="checkout-price-actions">
                            <span className="checkout-row-total">
                                {item.price * item.amount} $
                            </span>
                            <button
                                className="checkout-trash-btn"
                                onClick={() => removeProduct(item.productId)}
                                title="Remove product from cart"
                            >
                                🗑️
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="checkout-summary-footer">
                <div className="checkout-total-row">
                    <span className="checkout-total-label">Total Price:</span>
                    <span className="checkout-total-value">{totalPrice} $</span>
                </div>

                <div className="checkout-action-buttons">
                    <button
                        className="checkout-clear-btn"
                        onClick={clearCart}
                        disabled={loading}
                    >
                        Clear Cart 🧹
                    </button>

                    <button
                        className="checkout-submit-btn"
                        onClick={handleSubmitOrder}
                        disabled={loading}
                    >
                        {loading ? "Submitting..." : "Submit Order 🚀"}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default CheckoutPage;
