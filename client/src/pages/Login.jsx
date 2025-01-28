import React, { useState } from "react";
import { validateEmail } from "../utils/validations";
import axiosInstance from "../utils/axiosInstance";
import { useNavigate } from "react-router-dom";
import PasswordInput from "../components/inputs/PasswordInput";
import { jwtDecode } from "jwt-decode";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
  
    // Validate email
    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }
  
    // Validate password
    if (!password) {
      setError("Please enter a password.");
      return;
    }
  
    // Clear previous errors
    setError(null);
  
    try {
      const response = await axiosInstance.post("/login", {
        email,
        password,
      });
  
      if (response.data && response.data.accessToken) {
        // Save token to localStorage
        localStorage.setItem("token", response.data.accessToken);
  
        // Decode token to get the role
        const decodedToken = jwtDecode(response.data.accessToken);
        const userRole = decodedToken.role;
  
        // Navigate to the appropriate page based on the role
        if (userRole === 'Admin' || userRole === 'Manager') {
          navigate("/home"); // Admin or Manager should be redirected to Home
        } else {
          navigate("/employee-dashboard"); // Other users should be redirected to Employee Dashboard
        }
      }
    } catch (error) {
      if (error.response) {
        console.log("Error Response:", error.response);
  
        if (error.response.data && error.response.data.message) {
          setError(error.response.data.message);
        } else {
          setError("An unexpected error occurred. Please try again.");
        }
      } else if (error.request) {
        console.log("No response received:", error.request);
        setError("No response from server. Please check your network connection.");
      } else {
        console.log("Error during request setup:", error.message);
        setError("An unexpected error occurred. Please try again.");
      }
    }
  };
  

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-sm p-6 bg-white rounded-lg shadow-md">
        <h2 className="mb-6 text-2xl font-semibold text-center text-gray-700">Login</h2>
        <form onSubmit={handleLogin}>
          {/* Email Input */}
          <div className="mb-4">
            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-600">
              Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 text-sm  border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Password Input */}
          <div className="mb-6">
            <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-600">
              Password
            </label>
            <PasswordInput value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>

          {/* Error Message */}
          {error && (
            <p className="mb-4 text-xs text-red-500">
              {error}
            </p>
          )}

          {/* Login Button */}
          <button
            type="submit"
            className="w-full px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
