import React, { useEffect, useState } from 'react';
import OrderCard from './OrderCard/OrderCard';
import './MyOrdersPage.css';
import API_URL from '../../config.js';
import { useAuthorization } from '../../context/AuthorizationContext.js';

function MyOrdersPage() {
    const { userId, token } = useAuthorization();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!token || !userId) {
            return;
        }

        const fetchOrders = () => {
            setLoading(true);
            fetch(`${API_URL}/orders`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                    'user-id': userId
                }
            })
                .then(res => {
                    if (!res.ok) throw new Error('Failed to fetch orders from server');
                    return res.json();
                })
                .then(data => {
                    setOrders(Array.isArray(data) ? data : data.orders || []);
                    setError(null);
                })
                .catch((err) => {
                    console.log('Error:', err);
                    setError('Failed to load orders');
                })
                .finally(() => setLoading(false));
        };

        fetchOrders();
    }, [userId, token]);

    const handleOrderDeleted = (orderId) => {
        setOrders(prevOrders => prevOrders.filter(o => o._id !== orderId));
    };

    const handleOrderUpdated = (updatedOrderId) => {
        if (!token) return;

        fetch(`${API_URL}/orders/${updatedOrderId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
            .then(res => {
                if (!res.ok) throw new Error('Failed to fetch refreshed order details');
                return res.json();
            })
            .then(freshOrderFromServer => {
                setOrders(prevOrders =>
                    prevOrders.map(o => o._id === updatedOrderId ? freshOrderFromServer : o)
                );
            })
            .catch(err => console.error('Error syncing updated order details:', err));
    };

    if (!token) return <div className="orders-error">Please log in to view your orders.</div>;
    if (loading || !userId) return <div className="orders-loading">Loading orders...</div>;
    if (error) return <div className="orders-error">{error}</div>;
    if (orders.length === 0) return <div className="orders-empty">No orders yet.</div>;

    return (
        <div className="orders-container">
            <h1 className="orders-title">My Orders</h1>
            <div className="orders-list">
                {orders.map(order => (
                    <OrderCard
                        key={order._id} // שינוי ל-_id
                        order={order}
                        onDeleted={handleOrderDeleted}
                        onUpdated={handleOrderUpdated}
                    />
                ))}
            </div>
        </div>
    );
}

export default MyOrdersPage;