import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./Register.css";
import API_URL from "../../config";

const validateUserForm = (userData) => {
    if (!userData || typeof userData !== "object" || Array.isArray(userData)) {
        return { isValid: false, message: "Data must be a valid object" };
    }

    const nameRegex = /^[A-Za-z\s'-]{2,50}$/;
    const usernameRegex = /^[A-Za-z0-9_]{3,20}$/;
    const phoneRegex = /^\+?[0-9]{7,15}$/;
    const passwordRegex = /^\S{4,20}$/;

    const {
        name,
        age,
        location,
        username,
        password,
        confirmPassword,
        phoneNumber,
        role,
    } = userData;

    if (
        !name ||
        !age ||
        !username ||
        !password ||
        !confirmPassword ||
        !phoneNumber ||
        !role
    ) {
        return { isValid: false, message: "All fields are required" };
    }

    if (password !== confirmPassword) {
        return { isValid: false, message: "Passwords do not match" };
    }

    const allowedRoles = ["regular", "restaurantOwner"];
    if (!allowedRoles.includes(role)) {
        return {
            isValid: false,
            message: "Please select a valid role from the list",
        };
    }

    if (location && typeof location === "object") {
        if (
            location.lat === "" ||
            location.lon === "" ||
            location.lat === undefined ||
            location.lon === undefined
        ) {
            return {
                isValid: false,
                message: "Location must have both lat and lon defined",
            };
        }

        const lat = Number(location.lat);
        const lon = Number(location.lon);

        if (isNaN(lat) || isNaN(lon)) {
            return {
                isValid: false,
                message: "Location must have both lat and lon as valid numbers",
            };
        }
        if (lat < -90 || lat > 90 || lon < -180 || lon > 180) {
            return {
                isValid: false,
                message:
                    "Latitude must be between -90 and 90, and longitude between -180 and 180",
            };
        }
    } else {
        return { isValid: false, message: "Location is required" };
    }

    if (!nameRegex.test((name || "").trim()))
        return {
            isValid: false,
            message:
                "Name must be between 2 and 50 characters (English letters and spaces only)",
        };
    if (!usernameRegex.test(username))
        return {
            isValid: false,
            message:
                "Username must be 3-20 characters (letters, numbers, and underscores only)",
        };
    if (!phoneRegex.test(phoneNumber))
        return {
            isValid: false,
            message: "Phone number must be 7-15 digits, optional leading +",
        };
    if (!passwordRegex.test(password))
        return {
            isValid: false,
            message:
                "Password must be between 4 and 20 characters and cannot contain spaces",
        };

    const ageNum = Number(age);
    if (!Number.isInteger(ageNum) || ageNum < 0 || ageNum > 130) {
        return {
            isValid: false,
            message: "Valid age: 0-130 years",
        };
    }

    return { isValid: true, message: "User data is valid." };
};

const Register = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        age: "",
        location: { lat: "", lon: "" },
        phoneNumber: "",
        username: "",
        password: "",
        confirmPassword: "",
        role: "",
    });

    const [profileFile, setProfileFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const fileInputRef = useRef(null);

    useEffect(() => {
        return () => {
            if (
                imagePreview &&
                typeof imagePreview === "string" &&
                imagePreview.startsWith("blob:")
            ) {
                URL.revokeObjectURL(imagePreview);
            }
        };
    }, [imagePreview]);

    const handleImageChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            if (imagePreview) {
                URL.revokeObjectURL(imagePreview);
            }
            setProfileFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setError("");

        let sanitizedValue = value;
        if (name === "name") {
            sanitizedValue = value
                .replace(/[\u200B-\u200D\uFEFF]/g, "")
                .replace(/[\u202A-\u202E\u200E\u200F]/g, "");
        }

        if (name.startsWith("location.")) {
            const field = name.split(".")[1];
            setFormData((prev) => ({
                ...prev,
                location: { ...prev.location, [field]: sanitizedValue },
            }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: sanitizedValue }));
        }
    };

    const handleSuccessClose = () => {
        setSuccessMessage("");
        navigate("/login");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccessMessage("");

        const validationObject = { ...formData, profileImage: profileFile };
        const validation = validateUserForm(validationObject);

        if (!validation.isValid) {
            setError(validation.message);
            return;
        }

        setLoading(true);

        const dataToSend = new FormData();
        dataToSend.append("name", formData.name || "");
        dataToSend.append("age", formData.age || "");
        dataToSend.append("phoneNumber", formData.phoneNumber || "");
        dataToSend.append("username", formData.username || "");
        dataToSend.append("password", formData.password || "");
        dataToSend.append("role", formData.role || "");
        dataToSend.append("location[lat]", formData.location?.lat || "");
        dataToSend.append("location[lon]", formData.location?.lon || "");

        if (profileFile) {
            dataToSend.append("profileImage", profileFile);
        }

        try {
            const response = await fetch(`${API_URL}/users`, {
                method: "POST",
                body: dataToSend,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Registration failed");
            }

            setSuccessMessage("Your registration was completed successfully!");
        } catch (err) {
            console.error("Error:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="register-wrapper">
            {error && (
                <div className="modal-overlay">
                    <div className="modal-box error-modal">
                        <div className="modal-icon">⚠️</div>
                        <h3>Error</h3>
                        <p>{error}</p>
                        <button
                            className="btn-modal-close"
                            onClick={() => setError("")}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}

            {successMessage && (
                <div className="modal-overlay">
                    <div className="modal-box success-modal">
                        <div className="modal-icon">✅</div>
                        <h3>Success!</h3>
                        <p>{successMessage}</p>
                        <button
                            className="btn-modal-close"
                            onClick={handleSuccessClose}
                        >
                            Continue to Login
                        </button>
                    </div>
                </div>
            )}

            <div className="register-container">
                <h2>Registration</h2>

                <form onSubmit={handleSubmit}>
                    <div className="avatar-upload-container">
                        <div
                            className="avatar-preview"
                            onClick={() => fileInputRef.current?.click()}
                            style={{
                                backgroundImage: `url(${imagePreview || ""})`,
                            }}
                        >
                            {!imagePreview && (
                                <span className="upload-hint">Add image</span>
                            )}
                        </div>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleImageChange}
                            accept="image/*"
                            style={{ display: "none" }}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="name">Name</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name || ""}
                            onChange={handleChange}
                            placeholder="Israel Israeli"
                            required
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="age">Age</label>
                            <input
                                type="number"
                                id="age"
                                name="age"
                                min="1"
                                max="120"
                                value={formData.age || ""}
                                onChange={handleChange}
                                placeholder="25"
                                required
                            />
                        </div>

                        <div className="location-section">
                            <label className="section-label">Location</label>
                            <div className="form-row">
                                <div className="form-group">
                                    <input
                                        type="number"
                                        step="any"
                                        id="lat"
                                        name="location.lat"
                                        value={formData.location?.lat || ""}
                                        onChange={handleChange}
                                        placeholder="Lat"
                                        min="-90"
                                        max="90"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <input
                                        type="number"
                                        step="any"
                                        id="lon"
                                        name="location.lon"
                                        value={formData.location?.lon || ""}
                                        onChange={handleChange}
                                        placeholder="Lon"
                                        min="-180"
                                        max="180"
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="phoneNumber">Phone Number</label>
                        <input
                            type="tel"
                            id="phoneNumber"
                            name="phoneNumber"
                            value={formData.phoneNumber || ""}
                            onChange={handleChange}
                            placeholder="0501234567"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={formData.username || ""}
                            onChange={handleChange}
                            placeholder="israel123"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password || ""}
                            onChange={handleChange}
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="confirmPassword">
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={formData.confirmPassword || ""}
                            onChange={handleChange}
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="role">Role</label>
                        <select
                            id="role"
                            name="role"
                            value={formData.role || ""}
                            onChange={handleChange}
                            required
                        >
                            <option value="" disabled>
                                Choose your role:
                            </option>
                            <option value="restaurantOwner">
                                Restaurant Owner
                            </option>
                            <option value="regular">Regular</option>
                        </select>
                    </div>

                    <button
                        type="submit"
                        className="btn-submit"
                        disabled={loading}
                    >
                        {loading ? "Registering..." : "Register"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Register;
