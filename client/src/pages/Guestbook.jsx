import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Guestbook() {
    const [entries, setEntries] = useState([]);
    const [pendingEntries, setPendingEntries] = useState([]);
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

    async function loadPendingEntries() {
        const token = localStorage.getItem("token");
        try {
            const res = await fetch("/api/guestbook/pending", {
                headers: { "Authorization": `Bearer ${token}` }
            });

            if (!res.ok) {
                throw new Error(`Server responded with status: ${res.status}`);
            }

            const data = await res.json();
            setPendingEntries(data);
        } catch (error) {
            console.error("Error loading pending guestbook entries:", error);
        }
    }

    useEffect(() => {
        loadEntries();
        if (isAdmin) {
            loadPendingEntries();
        }
    }, [isAdmin]);

    async function handleSubmit(e) {
        e.preventDefault();
        const token = localStorage.getItem("token");

        const res = await fetch("/api/guestbook", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ displayName, message })
        });

        if (res.ok) {
            alert("Submitted for admin approval!");
            setDisplayName("");
            setMessage("");
            loadEntries();
            if (isAdmin) loadPendingEntries();
        } else {
            const err = await res.json();
            alert(err.error || "Error processing entry submission.");
        }
    }

    async function likeEntry(id) {
        // Grab the token from localStorage for authentication
        const token = localStorage.getItem("token");
        if (!token) {
            alert("You must be logged in to like an entry.");
            return;
        }

        try {
            const res = await fetch(`/api/guestbook/${id}/like`, {
                method: "POST",
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` }
            });
            if (res.ok) {
                loadEntries();
            } else {
                const err = await res.json();
                alert(err.error || "Error liking entry.");
            }
        } catch (error) {
            console.error("Error liking entry:", error);
        }
    }
    async function approveEntry(id) {
        const token = localStorage.getItem("token");
        if (!token) {
            alert("You must be logged in to approve an entry.");
            return;
        }

        try {
            const res = await fetch(`/api/guestbook/${id}/approve`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` }
            });
            if (res.ok) {
                alert("Entry approved successfully!");
                loadEntries();
                loadPendingEntries();
            } else {
                const err = await res.json();
                alert(err.error || "Error approving entry.");
            }
        } catch (error) {
            console.error("Error approving entry:", error);
        }
    }
    async function deleteEntry(id) {
        if (!window.confirm("Are you sure you want to delete this entry?")) {
            return;
        }
        const token = localStorage.getItem("token");
        if (!token) {
            alert("You must be logged in to delete an entry.");
            return;
        }

        try {
            const res = await fetch(`/api/guestbook/${id}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` }
            });
            if (res.ok) {
                alert("Entry deleted successfully!");
                loadEntries();
                loadPendingEntries();
            } else {
                const err = await res.json();
                alert(err.error || "Error deleting entry.");
            }
        } catch (error) {
            console.error("Error deleting entry:", error);
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
                    <button type="button" onClick={() => navigate("/login")} className="submit-button">
                        Go to Login
                    </button>
                </div>
            )}

            {/* Admin Moderation Panel — Cleanly Separated */}
            {isAdmin && (
                <div className="admin-moderation-section">
                    <h2 className="admin-section-title">Pending Moderation Queue</h2>
                    {pendingEntries.length === 0 ? (
                        <p className="guestbook-status">No entries awaiting verification.</p>
                    ) : (
                        <div className="entries-list">
                            {pendingEntries.map((entry) => (
                                <div key={entry.id} className="entry-card admin-pending-card">
                                    <div className="entry-header">
                                        <strong className="entry-author">{entry.displayName}</strong>
                                        <span className="admin-tag-text">Pending Approval</span>
                                    </div>
                                    <p className="entry-message">{entry.message}</p>
                                    <div className="admin-card-controls">
                                        <button type="button" onClick={() => approveEntry(entry.id)} className="approve-action-btn">
                                            Approve
                                        </button>
                                        <button type="button" onClick={() => deleteEntry(entry.id)} className="delete-action-btn">
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Main Public Entries Feed — Visible to Everyone */}
            <h2 className="feed-section-title" style={{ marginTop: "3rem" }}>Messages</h2>
            <div className="entries-list">
                {loading && <p className="guestbook-status">Loading entries...</p>}
                {error && <p className="form-inactive-notice">Error loading entries: {error}</p>}
                {!loading && !error && entries.length === 0 && (
                    <p className="guestbook-status">No entries found or approved yet. Be the first to leave a message!</p>
                )}
                {!loading && !error && entries.map((entry) => (
                    <div key={entry.id} className="entry-card">
                        <div className="entry-header">
                            <strong className="entry-author">{entry.displayName}</strong>
                            <button
                                type="button"
                                onClick={() => likeEntry(entry.id)}
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
                                <button type="button" onClick={() => deleteEntry(entry.id)} className="delete-action-btn">
                                    Remove Public Post
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
