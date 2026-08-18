import React, { useState } from 'react';
import "./ProductCard.css";
import AmountSelector from "./AmountSelector";
import { useCart } from "../../context/CartContext";

const ProductCard = ({ product }) => {
    const { addItem } = useCart();
    const [amount, setAmount] = useState(1);

    const handleQuantityChange = (delta) => {
        setAmount(prevAmount => Math.max(1, prevAmount + delta));
    };

    const addToCart = () => {
        const itemToAdd = {
            productId: product.id || product._id || product.productId,
            name: product.name,
            price: Number(product.price),
            restaurantId: product.restaurantId,
            ingredients: product.ingredients,
            description: product.description
        };

        addItem(itemToAdd, amount);
        alert(`${amount} x ${product.name} added to cart! 🛒`);
        setAmount(1);
    };

    return (
        <div className="card product-card">
            <div className="product-card-header">
                <div>
                    <h3>{product.name}</h3>
                    <p className="product-price">{product.price}$</p>
                </div>
            </div>

            {product.ingredients && (
                <p className="product-meta">Ingredients: {product.ingredients.join(", ")}</p>
            )}
            <p className="product-description">{product.description}</p>

            <div className="product-card-footer">
                <AmountSelector
                    amount={amount}
                    onIncrease={() => handleQuantityChange(1)}
                    onDecrease={() => handleQuantityChange(-1)}
                    onAmountChange={(value) => setAmount(Math.max(1, value))}
                />

                <button type="button" className="btn btn-primary" onClick={addToCart}>
                    Add to Cart
                </button>
            </div>
        </div>
    );
};

export default ProductCard;