export default function Footer() {
    const currentYear = new Date().getFullYear()
    return (
        <footer className="footer">
            <p className="footer-text">
                LaTorya Hoyle-Sadler • Creator of ToyMind Interactive &copy; {currentYear} • All rights reserved.
            </p>
        </footer>
    );
}