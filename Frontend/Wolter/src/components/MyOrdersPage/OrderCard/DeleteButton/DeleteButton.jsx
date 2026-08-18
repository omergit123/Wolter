import React from 'react';
import './DeleteButton.css';
import API_URL from '../../../../config.js';
import { useAuthorization } from '../../../../context/AuthorizationContext.js';

function DeleteButton({ orderId, onDeleted }) {
    const { token } = useAuthorization();

    const handleDelete = () => {
        if (!token) {
            return;
        }
        // Adjust the URL path to match your exact backend routing (removed internal '/api' for consistency)
        fetch(`${API_URL}/orders/${orderId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}` // Passing the token to authorize the deletion action
            }
        })
            .then(res => {
                if (!res.ok) {
                    throw new Error('Failed to delete order from server');
                }
                // Notify parent state to remove the order from the UI immediately upon successful deletion
                onDeleted(orderId);
            })
            .catch((err) => console.error('Failed to delete order:', orderId, err));
    };

    return (
        <button className="btn-delete" onClick={handleDelete}>
            🗑️ Delete
        </button>
    );
}

export default DeleteButton;