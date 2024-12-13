import React from "react";  

const Login = () => {  
  return (  
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">  
      <div className="bg-white p-8 rounded-lg shadow-md w-[24rem]">  
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>  
        <form>  
          <div className="mb-4">  
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">  
              Email  
            </label>  
            <input  
              type="email"  
              id="email"  
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"  
              placeholder="Enter your email"  
            />  
          </div>  
          <div className="mb-4">  
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">  
              Password  
            </label>  
            <input  
              type="password"  
              id="password"  
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"  
              placeholder="Enter your password"  
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