import { useState } from "react";

export default function Contact() {

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: ""
    });
    // to create an error message for form validation.
    const [error, setError] = useState("");
    // to create a success message after form submission.
    const [success, setSuccess] = useState(false);
    // to create real-time validation for email input.
    const [emailValid, setEmailValid] = useState(false);
    // Regular expression used to validate a basic email format.
    const emailPattern = /^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/;
    // This function updates the form state whenever the user types.
    function handleChange(event) {
        const { name, value } = event.target;
        // updates whichever field the user is typing in.
        setFormData({
            ...formData,
            [name]: value
        });
        // This if statment performs live validation using an email pattern.
        if (name === "email") {
            setEmailValid(emailPattern.test(value));
        }
    }
    // This function handles the form submission
    function handleSubmit(event) {
        event.preventDefault();

        setError("");
        setSuccess(false);

        if (!formData.name || !formData.email || !formData.message) {
            setError("Please complete all fields.");
            return;
        }

        // Prevents invalid email formats from being submitted.
        if (!emailPattern.test(formData.email)) {
            setError("Please enter a valid email address.");
            return;
        }

        setSuccess(true);

        setFormData({
            name: "",
            email: "",
            message: ""
        });
        // This resets the live email validation after submitting
        setEmailValid(false);
    }

    return (
        <main className="contact-page">

            <section className="contact-header">

                <h1>Contact</h1>

                <p>
                    Let's build something meaningful together.
                </p>

            </section>

            <form
                className="contact-form"
                onSubmit={handleSubmit}
            >

                <label>
                    Name
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter your name"
                    />
                </label>

                <label>
                    Email
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter your email"
                    />
                </label>
                {/* Displays live email validation while typing. */}
                {formData.email && (
                    <p className={emailValid ? "valid" : "invalid"}>
                        {emailValid
                            ? "✅ Valid email address."
                            : "❌ Enter a valid email (example@email.com)."}
                    </p>
                )}

                <label>
                    Message
                    <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Enter your message"
                    />
                </label>

                {error && (
                    <p className="error-message">
                        ❌ {error}
                    </p>
                )}

                {success && (
                    <p className="success-message">
                        Thank you for reaching out! Connection Established ✅
                    </p>
                )}

                <button type="submit" className="submit-button">
                    Send Message
                </button>

            </form>

        </main>
    );
}
