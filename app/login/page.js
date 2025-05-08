"use client"
import Link from "next/link";
import FormInput from "../../components/FormInput";
import "./Login.css";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Login() {

  const [error, setError] = useState('');
  const router = useRouter();


  const [formData , setFormData] = useState({
    email:'',
    password:'',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log('Login button clicked!');

    // Simple validation
    if (!formData.email || !formData.password) {
      console.log('Please fill out all fields.');
      return;
    }
    else{
      try{
        const response = await fetch("http://localhost:8080/api/users/login", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json", // Ensure the correct content type
      },
        body: JSON.stringify( formData ),
    })
    if (!response.ok) {
      throw new Error("Login failed");

  }

  alert(
    "Login successful!"
  );
  router.push('/home')

  const data = await response.json();
  console.log("Login successful:", data);
  return data;
} catch (error) {
  console.log("Error logging in:", error.message);
}
    }

    
    // Reset error
    setError('');

  };

  const handleCredentialResponse = (response) => {
    console.log('Encoded JWT ID token:', response.credential);
    // Handle token for authentication, send it to the server, etc.
  };

  const handleGoogleLogin =async (e) => {
    window.location.href = "http://localhost:8080/oauth2/authorization/google"; 

  };



  return (
    <div className="center-container bg-gray">
      <div className="login-container">
        {/* Left: Form */}
        <div className="login-form-container">
          <div className="login-form">
            <h1>Log In</h1>
            <FormInput
              label="Email"
              name ="email"
              type="email"
              placeholder="Enter your email address"
              icon="email"
              onChange={handleChange}
              value={formData.email}
            />
            <FormInput
              label="Password"
              type="password"
              name = "password"
              placeholder="Enter your password"
              icon="password"
              onChange={handleChange}
              value={formData.password}
            />
            <div className="checkbox-container">
              <label>
                <input type="checkbox" />
                Remember me
              </label>
              <Link href="/forget-password">Forgot Password</Link>
            </div>
            <button className="login-button" onClick={handleLogin}>Log In</button>
            <button className="google-button" onClick={handleGoogleLogin}>
              <img src="image/gmail.jpeg" alt="Google" className="w-5 h-5" />
              <span>Sign in with Google</span>
            </button>
            <p className="signup-link">
              Don’t have an account? <Link href="/register">Sign Up</Link>
            </p>
          </div>
        </div>

        {/* Right Section - Image */}
        <div className="login-image">
          <div className="overlay"></div>
          <div className="text-container">
            <h2 className="text-white">Welcome Here</h2>
            <p className="text-white small-text">
              Access your personal account by logging in
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}