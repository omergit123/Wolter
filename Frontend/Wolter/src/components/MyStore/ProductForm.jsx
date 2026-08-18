import React, { useState, useEffect } from "react";

// component for the product form, shows the form for creating/editing a product and handles the submit logic.
const ProductForm = ({
    initialData,
    onSubmit,
    onCancel,
    submitLabel = "Save Product",
}) => {
    const [formData, setFormData] = useState({
        name: "",
        price: "",
        description: "",
        ingredients: "",
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name || "",
                price: initialData.price || "",
                ingredients: Array.isArray(initialData.ingredients)
                    ? initialData.ingredients.join(" ")
                    : "",
                description: initialData.description || "",
            });
        }
    }, [initialData]);

    // validation for product.
    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = "product name is required";
        }

        const priceRegex = /^\d+\.\d{2}$/;

        if (
            !formData.price ||
            typeof formData.price !== "string" ||
            !priceRegex.test(formData.price)
        ) {
            newErrors.price =
                "price must be a positive number with exactly two decimal places";
        }

        if (!formData.description.trim()) {
            newErrors.description = "product description is required";
        }

        if (!formData.ingredients.trim()) {
            newErrors.ingredients = "at least one ingredient is required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            // convert the ingredients string into an array, splitting by spaces or commas, and trimming whitespace
            const ingredientsArray = formData.ingredients
                .split(/[\s,]+/)
                .map((item) => item.trim())
                .filter((item) => item.length > 0);

            const finalDataToSend = {
                name: formData.name,
                price: formData.price,
                description: formData.description,
                ingredients: ingredientsArray,
            };
            onSubmit(finalDataToSend);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="generic-form">
            <div className="form-group">
                <label>Product Name *</label>
                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={errors.name ? "input-error" : ""}
                />
                {errors.name && (
                    <span className="error-message">{errors.name}</span>
                )}
            </div>

            <div className="form-group">
                <label>Price ($) *</label>
                <input
                    type="number"
                    name="price"
                    step="0.01"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="0.00"
                    className={errors.price ? "input-error" : ""}
                />
                {errors.price && (
                    <span className="error-message">{errors.price}</span>
                )}
            </div>

            <div className="form-group">
                <label>Ingredients *</label>
                <input
                    type="text"
                    name="ingredients"
                    value={formData.ingredients}
                    onChange={handleChange}
                    placeholder="Enter ingredients separated by spaces (e.g., cheese onion tomato)"
                    className={errors.ingredients ? "input-error" : ""}
                />
                {errors.ingredients && (
                    <span className="error-message">{errors.ingredients}</span>
                )}
            </div>

            <div className="form-group">
                <label>Description *</label>
                <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="3"
                    className={errors.description ? "input-error" : ""}
                />
                {errors.description && (
                    <span className="error-message">{errors.description}</span>
                )}
            </div>

            <div className="form-actions">
                {onCancel && (
                    <button
                        type="button"
                        className="btn-cancel"
                        onClick={onCancel}
                    >
                        Cancel
                    </button>
                )}
                <button type="submit" className="btn-submit">
                    {submitLabel}
                </button>
            </div>
        </form>
    );
};

export default ProductForm;
