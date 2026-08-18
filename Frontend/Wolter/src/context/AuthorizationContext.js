import { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import API_URL from "../config";

const AuthorizationContext = createContext();

export function AuthorizationProvider({ children }) {
    const [token, setToken] = useState(() => {
        return localStorage.getItem("token");
    });
    const [userId, setUserId] = useState(null);
    const [user, setUser] = useState(null);
    const [loadingUser, setLoadingUser] = useState(true);

    useEffect(() => {
        if (token) {
            try {
                const decoded = jwtDecode(token);
                setUserId(decoded.userId);
            } catch (error) {
                logout();
            }
        } else {
            setUserId(null);
            setUser(null);
            setLoadingUser(false);
        }
    }, [token]);

    useEffect(() => {
        if (!userId || !token || userId === "null") {
            setUser(null);
            setLoadingUser(false);
            return;
        }

        const fetchUserDetails = async () => {
            try {
                const response = await fetch(`${API_URL}/users/${userId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (!response.ok) {
                    throw new Error("Failed to fetch user");
                }
                const data = await response.json();
                setUser(data);
            } catch (err) {
                console.error("Error fetching user in context:", err);
                setUser(null);
            } finally {
                setLoadingUser(false);
            }
        };

        fetchUserDetails();
    }, [userId, token]);

    const login = (newToken) => {
        localStorage.setItem("token", newToken);
        setToken(newToken);
    };

    const logout = () => {
        localStorage.removeItem("token");
        setToken(null);
        setUser(null);
    };

    const getProfileImageUrl = () => {
        if (!user || !user.image) return null;
        const backendBaseUrl = API_URL.replace(/\/api$/, "") || API_URL;

        if (/^https?:\/\//i.test(user.image)) return user.image;

        const normalized = user.image.replace(/\\/g, "/").replace(/^\/+/, "");
        if (normalized.startsWith("uploads/")) {
            return `${backendBaseUrl}/${normalized}`;
        }
        const uploadsIndex = normalized.indexOf("uploads/");
        if (uploadsIndex !== -1) {
            return `${backendBaseUrl}/${normalized.slice(uploadsIndex)}`;
        }
        const filename = normalized.split("/").pop();
        return `${backendBaseUrl}/uploads/${filename}`;
    };

    return (
        <AuthorizationContext.Provider
            value={{
                token,
                userId,
                user,
                profileImageUrl: getProfileImageUrl(),
                loadingUser,
                isAuthenticated: !!token,
                login,
                logout,
            }}
        >
            {children}
        </AuthorizationContext.Provider>
    );
}

export function useAuthorization() {
    return useContext(AuthorizationContext);
}