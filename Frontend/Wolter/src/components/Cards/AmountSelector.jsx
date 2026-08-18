import { useState } from "react";

// component for the amount selector in the product card.
function AmountSelector({ amount, onIncrease, onDecrease, onAmountChange }) {
    const [internalQuantity, setInternalQuantity] = useState(1);
    const quantity = amount !== undefined ? amount : internalQuantity;

    const updateQuantity = (newQuantity) => {
        if (newQuantity < 1) {
            newQuantity = 1;
        }
        if (onAmountChange) {
            onAmountChange(newQuantity);
        } else {
            setInternalQuantity(newQuantity);
        }
    };

    const handleChange = (event) => {
        const rawValue = event.target.value;
        if (rawValue === "") {
            updateQuantity(1);
            return;
        }

        const newValue = parseInt(rawValue, 10);
        if (Number.isInteger(newValue) && newValue >= 1) {
            updateQuantity(newValue);
        }
    };

    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button type="button" onClick={() => {
                if (onDecrease) onDecrease();
                else updateQuantity(quantity - 1);
            }} style={{ padding: '6px 10px' }}>
                -
            </button>
            <input
                id="quantity"
                type="number"
                min="1"
                value={quantity}
                onChange={handleChange}
                style={{ width: "60px", padding: "5px", fontSize: "16px", textAlign: 'center' }}
            />
            <button type="button" onClick={() => {
                if (onIncrease) onIncrease();
                else updateQuantity(quantity + 1);
            }} style={{ padding: '6px 10px' }}>
                +
            </button>
        </div>
    );
}

export default AmountSelector;
