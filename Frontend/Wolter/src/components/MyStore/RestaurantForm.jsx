import React, { useState, useEffect } from "react";

// component for the restaurant form, shows the form for creating/editing a restaurant and handles the submit logic.
const RestaurantForm = ({
    initialData,
    onSubmit,
    onCancel,
    submitLabel = "Save",
}) => {
    const [formData, setFormData] = useState({
        name: "",
        phoneNumber: "",
        description: "",
        category: "",
        location: { lat: 0, lon: 0 },
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name || "",
                phoneNumber: initialData.phoneNumber || "",
                description: initialData.description || "",
                category: initialData.category || "",
                location: {
                    lat: initialData.location?.lat ?? 0,
                    lon: initialData.location?.lon ?? 0,
                },
            });
        }
    }, [initialData]);

    // validation for restaurant.
    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = "restaurant name is required";
        }
        const phoneRegex = /^\d+$/;
        if (!formData.phoneNumber.trim()) {
            newErrors.phoneNumber = "phone number is required";
        } else if (!phoneRegex.test(formData.phoneNumber)) {
            newErrors.phoneNumber =
                "invalid phone number (must contain only digits)";
        }

        if (!formData.description.trim()) {
            newErrors.description = "description is required";
        }

        if (!formData.category) {
            newErrors.category = "category is required";
        }

        if (formData.location.lat === 0 && formData.location.lon === 0) {
            newErrors.location = "location is required";
        } else if (
            isNaN(formData.location.lat) ||
            isNaN(formData.location.lon)
        ) {
            newErrors.location = "location must be valid numbers";
        } else if (formData.location.lat < -90 || formData.location.lat > 90) {
            newErrors.location = "latitude must be between -90 and 90";
        } else if (
            formData.location.lon < -180 ||
            formData.location.lon > 180
        ) {
            newErrors.location = "longitude must be between -180 and 180";
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    // handle change for form inputs, updates the form data state.
    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name.startsWith("location.")) {
            const field = name.split(".")[1];
            setFormData((prev) => ({
                ...prev,
                location: {
                    ...prev.location,
                    [field]: value === "" ? "" : parseFloat(value),
                },
            }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    // handle form submit, validates the form and calls the onSubmit prop with the form data if valid.
    const handleSubmit = (e) => {
        e.preventDefault();

        if (validateForm()) {
            onSubmit(formData);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="generic-form">
            <div className="form-group">
                <label>Restaurant Name *</label>
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
                <label>Phone Number *</label>
                <input
                    type="text"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    placeholder="e.g., 0533333333"
                    className={errors.phoneNumber ? "input-error" : ""}
                />
                {errors.phoneNumber && (
                    <span className="error-message">{errors.phoneNumber}</span>
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

            <div className="form-group">
                <label>Category *</label>
                <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className={errors.category ? "input-error" : ""}
                >
                    <option value="">Select a category</option>
                    <option value="italian">italian</option>
                    <option value="sushi">sushi</option>
                    <option value="burger">burger</option>
                    <option value="vegan">vegan</option>
                    <option value="bbq">bbq</option>
                    <option value="cafe">cafe</option>
                </select>
                {errors.category && (
                    <span className="error-message">{errors.category}</span>
                )}
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label>Latitude *</label>
                    <input
                        type="number"
                        name="location.lat"
                        step="1"
                        value={formData.location.lat}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group">
                    <label>Longitude *</label>
                    <input
                        type="number"
                        name="location.lon"
                        step="1"
                        value={formData.location.lon}
                        onChange={handleChange}
                    />
                </div>
            </div>
            {errors.location && (
                <span className="error-message">{errors.location}</span>
            )}

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

export default RestaurantForm;
