import logo from "../assets/tmi-logo.png";
import { NavLink } from "react-router-dom";

export default function Navigation({
    isDarkMode,
    onToggleMode
}) {
    return (
        <nav className="navigation">
            <NavLink to="/" className="logo">
                <img
                    src={logo}
                    alt="ToyMind Interactive Logo"
                    loading="lazy"/>
            </NavLink>
            <div className="nav-links">
                <NavLink to="/">Home</NavLink>
                <NavLink to="/projects">Projects</NavLink>
                <NavLink to="/experience">Experience</NavLink>
                <NavLink to="/contact">Contact</NavLink>
                <NavLink to="/guestbook">Guestbook</NavLink>
                <button onClick={onToggleMode} className="theme-toggle">{isDarkMode ? "☀️" : "🌙"}</button>
            </div>
        </nav >
    )
}