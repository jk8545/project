// frontend/src/Login.js
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import HamburgerMenu from "../components/HamburgerMenu";

const Login = () => {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
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

        // Retrieve existing users from local storage
        const existingUsers = JSON.parse(localStorage.getItem("users")) || [];

        // Find the user with the given email
        const user = existingUsers.find(user => user.email === formData.email);
        if (!user) {
            setError("User not found!");
            return;
        }

        // Check if the password matches
        if (user.password !== formData.password) {
            setError("Incorrect password!");
            return;
        }

        // Store the current user in local storage
        localStorage.setItem("currentUser", JSON.stringify(user));

        // Clear form data
        setFormData({
            email: "",
            password: "",
        });

        // Redirect to home page after successful login
        navigate("/");
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

            {/* Login Form Container */}
            <div className="mt-20 bg-white p-8 rounded-lg shadow-md w-[24rem]">
                <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
                {error && (
                    <div className="text-red-500 text-sm mb-4 text-center">{error}</div>
                )}
                <form onSubmit={handleSubmit}>
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
                    <button
                        type="submit"
                        className="w-full bg-green-700 text-white py-2 px-4 rounded-md hover:bg-green-800"
                    >
                        Login
                    </button>
                </form>
                <div className="mt-4 text-center">
                    <p className="text-sm text-gray-600">Or login with:</p>
                    <div className="flex justify-center mt-2">
                        <button
                            onClick={() => {
                                // Here you would typically handle the Google login process
                                console.log("Google Login clicked");
                            }}
                            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 mr-2"
                        >
                            Google
                        </button>
                        <button
                            onClick={() => {
                                // Here you would typically handle the Facebook login process
                                console.log("Facebook Login clicked");
                            }}
                            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                        >
                            Facebook
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;