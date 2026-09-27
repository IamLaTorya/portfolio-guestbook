// import useState
import { useState } from "react";
// import router
import { Routes, Route } from "react-router-dom";
// import components
import Navigation from "./components/Navigation"
import Footer from "./components/Footer"
// import pages
import Home from './pages/Home'
import Experience from './pages/Experience'
import Projects from './pages/Projects'
import ProjectDetails from './pages/ProjectDetails'
import Contact from './pages/Contact'
// import css
import './App.css'

export default function App() {
  // this variable is used to toggle between light and dark mode.
  const [isDarkMode, setIsDarkMode] = useState(false);

  // create a function to toggle between light and dark mode
  const handleToggleMode = () => {
    // this pattern is used because it will always use the latest state value, without causing any closure issues.
    setIsDarkMode((previousTheme) => !previousTheme);
  };

  return (
    <>
      {/* every child component will inherit the mode */}
      <div className={isDarkMode ? "dark" : "light"}>
        <div className="app-wrapper">
          <Navigation
            // tells Navigation the current theme
            isDarkMode={isDarkMode}
            // gives Navigation permission to change the theme
            onToggleMode={handleToggleMode}
          />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/projects/:id" element={<ProjectDetails />} />
            <Route path="/experience" element={<Experience />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
          <Footer />
        </div>
      </div>
    </>
  )
}
