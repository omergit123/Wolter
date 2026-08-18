import React, { useState, useEffect, useCallback } from "react";
import RestaurantForm from "./RestaurantForm";
import ProductForm from "./ProductForm";
import { useAuthorization } from "../../context/AuthorizationContext";
import "./RestaurantEditor.css";
import API_URL from "../../config";

const RestaurantEditor = ({ restaurantId, onSave, onBack }) => {
    const [restaurant, setRestaurant] = useState(null);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [showProductForm, setShowProductForm] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

    const [isSubmitting, setIsSubmitting] = useState(false);

    const { token, userId } = useAuthorization();

    const fetchRestaurantData = useCallback(async () => {
        try {
            setLoading(true);
            const response = await fetch(
                `${API_URL}/restaurants/${restaurantId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            );
            if (!response.ok) {
                throw new Error("Failed to fetch restaurant");
            }
            const data = await response.json();
            setRestaurant(data);
            setProducts(data.menu || []);
        } catch (err) {
            setError(err.message);
            console.error("Error fetching restaurant:", err);
        } finally {
            setLoading(false);
        }
    }, [restaurantId, token]);

    useEffect(() => {
        if (!token || !userId || userId === "null" || !restaurantId) return;

        fetchRestaurantData();
    }, [restaurantId, token, userId, fetchRestaurantData]);

    // handle save for restaurant details.
    const handleSaveRestaurant = async (restaurantFormData) => {
        try {
            setIsSubmitting(true);
            const submitData = {
                ...restaurantFormData,
                userOwner: userId,
            };

            const response = await fetch(
                `${API_URL}/restaurants/${restaurantId}`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(submitData),
                },
            );

            if (!response.ok) {
                throw new Error("Failed to update restaurant");
            }

            alert("Restaurant updated successfully! ✨");
            if (onSave) {
                onSave();
            }
            onBack();
        } catch (err) {
            console.error("Error:", err);
            alert(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    // handle save for product (both create and edit).
    const handleSaveProduct = async (productFormData) => {
        const isEditing = !!selectedProduct;
        const url = isEditing
            ? `${API_URL}/restaurants/${restaurantId}/products/${selectedProduct.id || selectedProduct._id}`
            : `${API_URL}/restaurants/${restaurantId}/products`;

        try {
            setIsSubmitting(true);
            const response = await fetch(url, {
                method: isEditing ? "PATCH" : "POST",
                headers: {
                    "Content-Type": "application/json",
                    authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(productFormData),
            });

            if (!response.ok) {
                throw new Error(
                    `Failed to ${isEditing ? "update" : "create"} product`,
                );
            }

            alert(`Product ${isEditing ? "updated" : "created"} successfully!`);
            setShowProductForm(false);
            setSelectedProduct(null);
            await fetchRestaurantData();
        } catch (err) {
            console.error("Error:", err);
            alert(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    // handle delete for product.
    const handleDeleteProduct = async (productId) => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            try {
                setIsSubmitting(true);
                const response = await fetch(
                    `${API_URL}/restaurants/${restaurantId}/products/${productId}`,
                    {
                        method: "DELETE",
                        headers: {
                            authorization: `Bearer ${token}`,
                        },
                    },
                );

                if (!response.ok) {
                    throw new Error("Failed to delete product");
                }

                await fetchRestaurantData();
            } catch (err) {
                console.error("Error:", err);
                alert(err.message);
            } finally {
                setIsSubmitting(false);
            }
        }
    };

    if (loading) {
        return <div className="restaurant-editor">Loading...</div>;
    }

    if (error) {
        return <div className="restaurant-editor">Error: {error}</div>;
    }

    return (
        <div className="restaurant-editor">
            {isSubmitting && (
                <div className="submitting-bar">Saving changes...</div>
            )}

            <div className="editor-header">
                <button
                    className="btn-back"
                    onClick={onBack}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? "Please wait..." : "← Back"}
                </button>
                <h1>{restaurant?.name}</h1>
            </div>

            <div className="editor-content">
                <section className="editor-section">
                    <h2>Restaurant Details</h2>
                    <RestaurantForm
                        initialData={restaurant}
                        onSubmit={handleSaveRestaurant}
                        submitLabel={
                            isSubmitting
                                ? "Saving Details..."
                                : "Save Restaurant Details"
                        }
                    />
                </section>

                <section className="editor-section">
                    <div className="products-header">
                        <h2>Menu Products</h2>
                        <button
                            className="btn-add-product"
                            disabled={isSubmitting}
                            onClick={() => {
                                setSelectedProduct(null);
                                setShowProductForm(true);
                            }}
                        >
                            + Add Product
                        </button>
                    </div>

                    {products.length === 0 ? (
                        <p className="no-products">No products yet.</p>
                    ) : (
                        <div className="products-table">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Price</th>
                                        <th>Description</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {products.map((product) => {
                                        const productId =
                                            product.id || product._id;
                                        return (
                                            <tr key={productId}>
                                                <td>{product.name}</td>
                                                <td>{product.price}</td>
                                                <td>{product.description}</td>
                                                <td className="actions">
                                                    <button
                                                        className="btn-product-edit"
                                                        disabled={isSubmitting}
                                                        onClick={() => {
                                                            setSelectedProduct(
                                                                product,
                                                            );
                                                            setShowProductForm(
                                                                true,
                                                            );
                                                        }}
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        className="btn-product-delete"
                                                        disabled={isSubmitting}
                                                        onClick={() =>
                                                            handleDeleteProduct(
                                                                productId,
                                                            )
                                                        }
                                                    >
                                                        {isSubmitting
                                                            ? "..."
                                                            : "Delete"}
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </section>
            </div>

            {showProductForm && (
                <div
                    className="modal-overlay"
                    onClick={() => {
                        if (isSubmitting) return;
                        setShowProductForm(false);
                        setSelectedProduct(null);
                    }}
                >
                    <div
                        className="modal-content"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="modal-header">
                            <h3>
                                {selectedProduct
                                    ? "✏️ Edit Product"
                                    : "✨ Add New Product"}
                            </h3>
                            <button
                                className="btn-close"
                                disabled={isSubmitting}
                                onClick={() => {
                                    setShowProductForm(false);
                                    setSelectedProduct(null);
                                }}
                            >
                                ×
                            </button>
                        </div>

                        <div style={{ padding: "20px" }}>
                            <ProductForm
                                initialData={selectedProduct}
                                onSubmit={handleSaveProduct}
                                onCancel={() => {
                                    setShowProductForm(false);
                                    setSelectedProduct(null);
                                }}
                                submitLabel={
                                    isSubmitting
                                        ? "Saving..."
                                        : selectedProduct
                                          ? "Update Product"
                                          : "Create Product"
                                }
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RestaurantEditor;
