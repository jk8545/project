// frontend/src/Contact.js
import React from 'react';
import { Link } from 'react-router-dom';
import HamburgerMenu from './HamburgerMenu';

const Contact = () => {
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
            {/* Navbar */}
            <div className="w-full flex justify-between px-5 items-center bg-gray-100 fixed top-0 left-0 right-0 z-10">
                <HamburgerMenu />
                <div className="hidden md:flex space-x-10">
                    <Link to="/" className="text-gray-700 hover:text-gray-900">Home</Link>
                    <Link to="/about" className="text-gray-700 hover:text-gray-900">About</Link>
                    <Link to="/paraphraser" className="text-gray-700 hover:text-gray-900">Paraphraser</Link>
                </div>
                <div className="flex space-x-5 [&>*]:bg-neutral-800 text-white [&>*]:px-4 [&>*]:py-0.5 [&>*]:rounded-full">
                    <Link to="/signup" className="text-white hover:bg-neutral-700">Signup</Link>
                    <Link to="/login" className="text-white hover:bg-neutral-700">Login</Link>
                </div>
            </div>

            {/* Contact Page Content */}
            <div className="mt-20 text-center">
                <h1 className="text-4xl font-bold mb-6">Contact Us</h1>
                <p className="text-lg text-gray-600">This is the contact page.</p>
            </div>
        </div>
    );
};

export default Contact;