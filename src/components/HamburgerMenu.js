// src/HamburgerMenu.js
import React, { useState } from "react";
import { Link } from "react-router-dom";

const HamburgerMenu = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <div className="relative">
            <button onClick={toggleMenu} className="text-3xl">
                ☰
            </button>
            {isMenuOpen && (
                <div className="absolute top-12 left-0 bg-white p-5 rounded-lg shadow-md">
                    <Link to="/" className="block mb-2" onClick={toggleMenu}>
                        Home
                    </Link>
                    <Link to="/about" className="block mb-2" onClick={toggleMenu}>
                        About
                    </Link>
                    <Link to="/paraphraser" className="block mb-2" onClick={toggleMenu}>
                        Paraphraser
                    </Link>
                    <Link to="/contact" className="block mb-2" onClick={toggleMenu}>
                        Contact
                    </Link>
                    <Link to="/signup" className="block mb-2" onClick={toggleMenu}>
                        Signup
                    </Link>
                    <Link to="/login" className="block" onClick={toggleMenu}>
                        Login
                    </Link>
                </div>
            )}
        </div>
    );
};

export default HamburgerMenu;