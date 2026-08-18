import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthorization } from "../../context/AuthorizationContext";
import "./Login.css";
import API_URL from "../../config";

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const { login } = useAuthorization();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        if (!username || !password) {
            setError("must fill all fields");
            setLoading(false);
            return;
        }

        try {
            const tokenResponse = await fetch(`${API_URL}/tokens`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, password }),
            });
            if (!tokenResponse.ok) {
                throw new Error(`error: ${tokenResponse.status}`);
            }
            const result = await tokenResponse.json();
            const tokenData = result.token;
            login(tokenData);
            navigate("/main");
        } catch (err) {
            setError("username or password is incorrect. please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <form className="login-form" onSubmit={handleSubmit}>
                <h2>login</h2>

                {error && <div className="error-message">{error}</div>}

                <div className="form-group">
                    <label htmlFor="username">user name:</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="enter your username..."
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="password">password:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="enter your password..."
                        required
                    />
                </div>

                <button
                    type="submit"
                    className="login-button"
                    disabled={loading}
                >
                    {loading ? "connecting..." : "login"}
                </button>
            </form>
        </div>
    );
}
