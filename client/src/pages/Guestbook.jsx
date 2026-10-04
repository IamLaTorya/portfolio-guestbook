import { useState, useEffect } from "react";

export default function Guestbook() {
    const [entries, setEntries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [displayName, setDisplayName] = useState("");
    const [message, setMessage] = useState("");

    // 1. Fetch entries from your database backend
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

    //Hook to handle loading and error states
    useEffect(() => {
        if (loading) {
            console.log("Loading guestbook entries...");
        }
        if (error) {
            console.error("Error loading guestbook entries:", error);
        }
    }, [loading, error]);

    // 2. Submit new entry payload
    async function handleSubmit(e) {
        e.preventDefault();

        const res = await fetch("/api/guestbook", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ displayName, message })
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

    // 3. Process backend schema likes using MongoDB _id
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

    // This return statement must be INSIDE the Guestbook function
    return (
        <div className="guestbook-page">
            <h1 className="guestbook-header">Guestbook</h1>

            {/* Form structure matches your contact page layout variables */}
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

            {/* Database Feed Module */}
            <div className="entries-list">
                {loading && <p className="guestbook-status">Loading entries...</p>}
                {error && <p className="form-inactive-notice">Error loading entries: {error}</p>}
                {!loading && !error && entries.length === 0 && <p className="guestbook-status">No entries found or approved yet. Be the first to leave a message!</p>}
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
                    </div>
                ))} 
            </div>
        </div>
    );
} 