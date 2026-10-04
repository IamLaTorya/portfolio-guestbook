import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Guestbook() {
    const [entries, setEntries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [displayName, setDisplayName] = useState("");
    const [message, setMessage] = useState("");

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        const adminCheck = localStorage.getItem("isAdmin") === "true";

        if (token) {
            setIsLoggedIn(true);
            setIsAdmin(adminCheck);
        }
    }, []);

    async function loadEntries() {
        try {
            setLoading(true);
            setError(null);

            const res = await fetch("/api/guestbook");

            if (!res.ok) {
                throw new Error(`Server responded with status: ${res.status}`);
            }

            const data = await res.json();
            setEntries(data);
        } catch (error) {
            console.error("Error loading guestbook data:", error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadEntries();
    }, []);

    async function handleSubmit(e) {
        e.preventDefault();
        const token = localStorage.getItem("token");

        const res = await fetch("/api/guestbook", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ _id: "TEMP_ID", displayName, message })
        });

        if (res.ok) {
            alert("Submitted for admin approval!");
            setDisplayName("");
            setMessage("");
            loadEntries();
        } else {
            const err = await res.json();
            alert(err.error || "Error processing entry submission.");
        }
    }

    async function likeEntry(id) {
        try {
            const res = await fetch(`/api/guestbook/${id}/like`, { method: "POST" });
            if (res.ok) {
                loadEntries();
            }
        } catch (error) {
            console.error("Error liking entry:", error);
        }
    }

    return (
        <div className="guestbook-page">
            <h1 className="guestbook-header">Guestbook</h1>

            {isAdmin && (
                <p className="admin-indicator-banner">
                    Logged in as Administrator
                </p>
            )}

            {isLoggedIn ? (
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        id="display-name"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        placeholder="Your Name"
                        required
                    />
                    <textarea
                        id="message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Your Message"
                        rows="4"
                        required
                    />
                    <button type="submit" className="submit-button">Submit Entry</button>
                </form>
            ) : (
                <div className="unauthenticated-notice-card">
                    <p className="notice-text">
                        You must be logged in to leave a message on the guestbook.
                    </p>
                    <button type="button" onClick={() => navigate("/login")}>
                        Go to Login
                    </button>
                </div>
            )}

            <div className="entries-list">
                {loading && <p className="guestbook-status">Loading entries...</p>}
                {error && <p className="form-inactive-notice">Error loading entries: {error}</p>}
                {!loading && !error && entries.length === 0 && (
                    <p className="guestbook-status">No entries found or approved yet. Be the first to leave a message!</p>
                )}
                {!loading && !error && entries.map((entry) => (
                    <div key={entry._id} className="entry-card">
                        <div className="entry-header">
                            <strong className="entry-author">{entry.displayName}</strong>
                            <button
                                type="button"
                                onClick={() => likeEntry(entry._id)}
                                className="like-button"
                                aria-label="Like post entry"
                            >
                                <span>❤️</span>
                                <span className="like-count">{entry.likes || 0}</span>
                            </button>
                        </div>
                        <p className="entry-message">{entry.message}</p>

                        {isAdmin && (
                            <div className="admin-card-controls">
                                <span className="admin-tag-text">[Admin Control Active]</span>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
