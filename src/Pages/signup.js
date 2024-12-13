import React, { useState } from "react";  

function Signup() {  
  const [formData, setFormData] = useState({  
    name: "",  
    email: "",  
    password: "",  
    confirmPassword: "",  
  });  

  const [error, setError] = useState("");  

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

    // Here you would typically handle the signup process (e.g., API call)  
    console.log("Signup form submitted:", formData);  

    // Example: Redirect to login page after successful signup  
    // navigate("/login");  
  };  

  return (  
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">  
      <div className="bg-white p-8 rounded-lg shadow-md w-[24rem]">  
        <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>  
        {error && (  
          <div className="text-red-500 text-sm mb-4 text-center">{error}</div>  
        )}  
        <form onSubmit={handleSubmit}>  
          <div className="mb-4">  
            <label  
              htmlFor="name"  
              className="block text-sm font-medium text-gray-700"  
            >  
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
            <label  
              htmlFor="email"  
              className="block text-sm font-medium text-gray-700"  
            >  
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
            <label  
              htmlFor="password"  
              className="block text-sm font-medium text-gray-700"  
            >  
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
            <label  
              htmlFor="confirmPassword"  
              className="block text-sm font-medium text-gray-700"  
            >  
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