import React from "react";
import DeleteButton from "./DeleteButton/DeleteButton";
import UpdateButton from "./UpdateButton/UpdateButton";
import "./OrderCard.css";

function OrderCard({ order, onDeleted, onUpdated }) {
    const currentOrderId = order._id;

    const itemsCount = Array.isArray(order.productsList)
        ? order.productsList.reduce((sum, item) => sum + (item.amount || 1), 0)
        : 0;

    const displayPrice =
        typeof order.totalPrice === "number" ? order.totalPrice : 0;

    return (
        <div className="modern-order-card">
            {/* Left Side: Pure Info Context */}
            <div className="order-info-block">
                <div className="order-badge-row">
                    <span className="modern-badge">Active</span>
                    <span className="modern-id">
                        #
                        {currentOrderId
                            ? currentOrderId.slice(0, 8)
                            : "00000000"}
                    </span>
                </div>
                <div className="order-meta-row">
                    <span className="modern-qty">📦 {itemsCount} item(s)</span>
                    <span className="modern-price">
                        ${displayPrice.toFixed(2)}
                    </span>
                </div>
            </div>

            {/* Right Side: Clean Fixed Control Actions */}
            <div className="order-controls-block">
                <UpdateButton
                    orderId={currentOrderId}
                    productsList={order.productsList}
                    userId={order.userId}
                    onUpdated={onUpdated}
                />
                <DeleteButton
                    orderId={currentOrderId}
                    onDeleted={onDeleted}
                />
            </div>
        </div>
    );
}

export default OrderCard;
