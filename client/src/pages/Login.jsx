import React, { useState } from "react";
import { validateEmail } from "../utils/validations";
import axiosInstance from "../utils/axiosInstance";
import { useNavigate } from "react-router-dom";
import PasswordInput from "../components/inputs/PasswordInput";
import { jwtDecode } from "jwt-decode";
import Logo from "../assets/logo.png"
import plumber from "../assets/plumber.png";

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
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4 relative">
    <div className="absolute top-0 left-0 p-8">
      <img src={Logo} className="w-62 obeject-fit"/>
    </div>
      <div className="max-w-3xl w-full bg-white shadow-lg rounded-lg overflow-hidden md:flex">
        {/* Left Side - Login Form */}
        <div className="w-full md:w-1/2 p-6 flex items-center justify-center">
          <div className="w-full max-w-sm">
           
            <h2 className="mb-3 text-4xl font-semibold text-start text-black">Login</h2>
            <h2 className="mb-6 text-xs font-semibold text-start text-gray-400">
              Welcome back, Enter your details
            </h2>
            <form onSubmit={handleLogin}>
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
                  className="w-full px-4 py-2 text-sm border-b-[1px] border-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="mb-6">
                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-600">
                  Password
                </label>
                <PasswordInput value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
              {error && <p className="mb-4 text-xs text-red-500">{error}</p>}
              <button
                type="submit"
                className="w-full px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Login
              </button>
            </form>
          </div>
        </div>
        {/* Right Side - Image with Gradient Background (Hidden on Mobile) */}
        <div className="hidden md:flex md:w-1/2 items-center justify-center bg-gradient-to-b from-blue-500 to-blue-300">
          <img src={plumber} alt="Plumber" className="w-full h-full object-cover" />
        </div>
      </div>
    </div>
  );
};

export default Login;
