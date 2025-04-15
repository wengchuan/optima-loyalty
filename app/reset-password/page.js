"use client";  // ✅ Ensures it's a Client Component

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation"; // ✅ Use useSearchParams instead of router.query
import axios from "axios";
import './reset.css'; 
import FormInput from "../../components/FormInput";

export default function ResetPassword() {
    const router = useRouter();
    const searchParams = useSearchParams(); // ✅ Correct way to get query params in App Router
    const token = searchParams.get("token"); // Extract token from URL

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");

    const [formData , setFormData] = useState({
        password:'',
        confPassword:''
      });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

    const handleReset = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setMessage("Passwords do not match!");
            return;
        }

        try {
            const response = await axios.post("http://localhost:8080/api/users/reset-password", {
                token,
                password,
            });

            alert("Password reset successful!");
            setTimeout(() => router.push("/login"), 2000); // Redirect to login
        } catch (error) {
            setMessage("Error resetting password.");
            console.error(error);
        }
    };

    return (
      <div className="center-container bg-gray">
          <div className="login-container">
            {/* Left: Form */}
            <div className="login-form-container">
              <div className="login-form">
                <h1>Log In</h1>
                <FormInput
                  type="password"
                  placeholder="New Password"
                  value={formData.password}
                  name="password"
                  onChange={handleChange}
                  required
                />
                    <FormInput
                  type="password"
                  placeholder="Confirm Password"
                  value={formData.confPassword}
                  name="confPassword"
                  onChange={handleChange}
                  required
                />
        
        
                <button className="login-button" onClick={handleReset}>Change Password</button>
                
           
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
