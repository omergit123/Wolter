import React, { useState } from 'react';
import UpdateOrderModal from './UpdateOrderModal';
import './UpdateButton.css';

function UpdateButton({ orderId, productsList, userId, onUpdated }) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <button className="btn-update" onClick={() => setIsModalOpen(true)}>
                ✏️ Update
            </button>

            {isModalOpen && (
                <UpdateOrderModal
                    orderId={orderId}
                    productsList={productsList}
                    userId={userId}
                    onUpdated={onUpdated}
                    onClose={() => setIsModalOpen(false)}
                />
            )}
        </>
    );
}

export default UpdateButton;