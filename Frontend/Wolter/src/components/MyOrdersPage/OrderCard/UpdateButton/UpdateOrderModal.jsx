import React, { useState, useEffect } from 'react';
import API_URL from '../../../../config.js';
import { useAuthorization } from '../../../../context/AuthorizationContext.js';

function UpdateOrderModal({ orderId, productsList, userId, onUpdated, onClose }) {
    const { token } = useAuthorization();
    const [currentProducts, setCurrentProducts] = useState(productsList || []);
    const [productNames, setProductNames] = useState({});
    const [loadingNames, setLoadingNames] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (!token || !userId || !productsList) {
            return;
        }

        const fetchPromises = productsList.map(item => {
            const resId = item.restaurantAndProduct?.restaurantId;
            const prodId = item.restaurantAndProduct?.productId;

            if (!resId || !prodId) {
                const fallbackId = prodId || item.productId || '';
                return Promise.resolve({ productId: fallbackId, name: `Product #${fallbackId.slice(0, 6)}` });
            }

            return fetch(`${API_URL}/restaurants/${resId}/products/${prodId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                    'user-id': userId
                }
            })
                .then(res => {
                    if (!res.ok) throw new Error('Product not found in this restaurant');
                    return res.json();
                })
                .then(productData => {
                    return { productId: prodId, name: productData.name || 'Unknown Product' };
                })
                .catch(err => {
                    console.error(`Failed to fetch product details for ${prodId}:`, err);
                    return { productId: prodId, name: `Product #${prodId.slice(0, 6)}` };
                });
        });

        Promise.all(fetchPromises)
            .then(results => {
                const namesMap = {};
                results.forEach(res => {
                    namesMap[res.productId] = res.name;
                });
                setProductNames(namesMap);
            })
            .catch(err => console.error('General promise tracking error:', err))
            .finally(() => setLoadingNames(false));

    }, [productsList, userId, token]);

    const handleQuantityChange = (index, delta) => {
        setCurrentProducts(prevProducts => {
            return prevProducts.map((item, idx) => {
                if (idx === index) {
                    const newAmount = Math.max(1, (item.amount || 1) + delta);
                    return { ...item, amount: newAmount };
                }
                return item;
            });
        });
    };

    const handleSaveChanges = () => {
        if (!token) return;
        setSaving(true);

        const cleanedProductsList = currentProducts.map(item => ({
            restaurantAndProduct: {
                restaurantId: item.restaurantAndProduct?.restaurantId,
                productId: item.restaurantAndProduct?.productId || item.productId
            },
            amount: item.amount || 1
        }));

        const payload = {
            productsList: cleanedProductsList,
            userId: userId
        };

        fetch(`${API_URL}/orders/${orderId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(payload)
        })
            .then(res => {
                if (!res.ok) {
                    console.error(`Server rejected PATCH with status: ${res.status}`);
                    throw new Error('Failed to patch order');
                }
                return true;
            })
            .then(() => {
                alert('Order updated successfully! ✏️');
                if (onUpdated) {
                    onUpdated(orderId);
                }
                onClose();
            })
            .catch(err => {
                console.error('Error patching order:', err);
                alert('Failed to save changes. Please try again.');
            })
            .finally(() => setSaving(false));
    };

    if (loadingNames) return (
        <div className="update-modal-overlay">
            <div className="update-modal-content"><h3>Loading product details... 🍔</h3></div>
        </div>
    );

    return (
        <div className="update-modal-overlay">
            <div className="update-modal-content">
                <h3>Update Order Quantities 📋</h3>
                <p className="modal-order-sub">Modifying Order ID: #{orderId.slice(0, 8)}...</p>

                <div className="modal-products-list">
                    {currentProducts.map((item, index) => {
                        const productId = item.restaurantAndProduct?.productId || item.productId;
                        const displayName = productNames[productId] || 'Product';

                        return (
                            <div key={index} className="modal-body-counter">
                                <span className="product-label-name">
                                    {displayName}:
                                </span>
                                <div className="quantity-picker-row">
                                    <button
                                        className="qty-picker-btn"
                                        onClick={() => handleQuantityChange(index, -1)}
                                        disabled={saving}
                                    >
                                        -
                                    </button>
                                    <span className="qty-picker-display">{item.amount || 1}</span>
                                    <button
                                        className="qty-picker-btn"
                                        onClick={() => handleQuantityChange(index, 1)}
                                        disabled={saving}
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="modal-actions-wrapper">
                    <button className="modal-btn-cancel" onClick={onClose} disabled={saving}>
                        Cancel
                    </button>
                    <button className="modal-btn-save" onClick={handleSaveChanges} disabled={saving}>
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default UpdateOrderModal;