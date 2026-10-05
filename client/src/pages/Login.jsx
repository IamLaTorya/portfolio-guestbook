import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000"

export default function Login() {
    const [isLogin, setIsLogin] = useState(true);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const navigate = useNavigate();

    // Evaluate credential existence upon component initialization
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            setIsLoggedIn(true);
        }
    }, []);

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const endpoint = isLogin ? `${API_URL}/api/auth/login` : `${API_URL}/api/auth/register`;

        try {
            const res = await fetch(endpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || data.error || "Authentication failed.");
            }

            if (isLogin) {
                localStorage.setItem("token", data.token);
                if (data.user?.role === "admin") {
                    localStorage.setItem("isAdmin", "true");
                }
                alert("Login successful!");
                setIsLoggedIn(true);
                navigate("/");
            } else {
                alert("Registration successful! Please log in.");
                setIsLogin(true);
                setPassword("");
            }
        } catch (err) {
            console.error("Authentication action failed:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    function handleLogout() {
        localStorage.removeItem("token");
        localStorage.removeItem("isAdmin");
        setIsLoggedIn(false);
        alert("You have been logged out safely.");
        navigate("/guestbook");
    }

    // Signed In User Profile Layout
    if (isLoggedIn) {
        return (
            <div className="login-container">
                <h1 className="guestbook-header">Account Panel</h1>
                <p className="login-status-text">You are currently logged in.</p>
                <button type="button" onClick={handleLogout} className="submit-button">
                    Sign Out
                </button>
            </div>
        );
    }

    // Standard Unauthenticated Access Layout
    return (
        <div className="login-container">
            <h1 className="guestbook-header">{isLogin ? "Login" : "Register"}</h1>

            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Username"
                    required
                    disabled={loading}
                />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    required
                    disabled={loading}
                />

                {error && <p className="form-inactive-notice login-status-text">{error}</p>}

                <button type="submit" className="submit-button" disabled={loading}>
                    {loading ? "Processing..." : isLogin ? "Sign In" : "Create Account"}
                </button>
            </form>

            <button
                type="button"
                onClick={() => {
                    setIsLogin(!isLogin);
                    setError(null);
                }}
                className="login-toggle-button"
            >
                {isLogin ? "Need an account? Register here" : "Already have an account? Login here"}
            </button>
        </div>
    );
}
