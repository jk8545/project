// frontend/src/Signup.js
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import HamburgerMenu from "../components/HamburgerMenu";

function Signup() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Password validation
        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match!");
            return;
        }

        // Clear error if passwords match
        setError("");

        // Retrieve existing users from local storage
        const existingUsers = JSON.parse(localStorage.getItem("users")) || [];

        // Check if user already exists
        const userExists = existingUsers.some(user => user.email === formData.email);
        if (userExists) {
            setError("User with this email already exists!");
            return;
        }

        // Store new user in local storage
        const newUser = {
            name: formData.name,
            email: formData.email,
            password: formData.password, // Note: Storing passwords in local storage is not secure
        };

        existingUsers.push(newUser);
        localStorage.setItem("users", JSON.stringify(existingUsers));

        // Clear form data
        setFormData({
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
        });

        // Redirect to login page after successful signup
        navigate("/login");
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
            {/* Navbar */}
            <div className="w-full flex justify-between px-5 items-center bg-gray-100 fixed top-0 left-0 right-0 z-10">
                <HamburgerMenu />
                <div className="hidden md:flex space-x-10">
                    <Link to="/about" className="text-gray-700 hover:text-gray-900">About</Link>
                    <Link to="/paraphraser" className="text-gray-700 hover:text-gray-900">Paraphraser</Link>
                    <Link to="/contact" className="text-gray-700 hover:text-gray-900">Contact</Link>
                </div>
                <div className="flex space-x-5 [&>*]:bg-neutral-800 text-white [&>*]:px-4 [&>*]:py-0.5 [&>*]:rounded-full">
                    <Link to="/signup" className="text-white hover:bg-neutral-700">Signup</Link>
                    <Link to="/login" className="text-white hover:bg-neutral-700">Login</Link>
                </div>
            </div>

            {/* Signup Form Container */}
            <div className="mt-20 bg-white p-8 rounded-lg shadow-md w-[24rem]">
                <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>
                {error && (
                    <div className="text-red-500 text-sm mb-4 text-center">{error}</div>
                )}
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                            Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                            placeholder="Enter your name"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                            placeholder="Enter your email"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                            placeholder="Enter your password"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                            placeholder="Confirm your password"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-green-700 text-white py-2 px-4 rounded-md hover:bg-green-800"
                    >
                        Sign Up
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Signup;