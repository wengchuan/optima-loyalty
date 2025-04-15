"use client"
import Link from "next/link";
import FormInput from "../../components/FormInput";
import "./Register.css";
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function Register() {
  const [error, setError] = useState('');
  const router = useRouter();

  const [formData , setFormData] = useState({
    email:'',
    username:'',
    phoneNumber:'',
    password:'',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    
    // Reset any previous errors
    setError('');
  
    // Validate fields
    if (!formData.email || !formData.password) {
      setError('Please fill out all fields.');
      return;
    }
  
    try {
      const response = await fetch("http://localhost:8080/api/users/signup", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
  
      // Check if the response is successful
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Register failed");
      }
  
      const data = await response.json();
      console.log("Register successful:", data);
      alert(
        "Register Successful"
      );
      router.push('/login')
  
      // Add navigation or state update logic here
    } catch (error) {
      setError(error.message);
      console.error("Error logging in:", error.message);
    }
  };



  return (
    <div className="register-container">
      {/* Left: Form */}
      <div className="register-form-container">
        <div className="register-form">
          <h1>Register</h1>
          <FormInput
            label="Name"
            type="text"
            placeholder="Enter your first name"
            icon="name"
            name = "username"
            formValue={formData.username}
            onChange={handleChange}
          />
          <FormInput
            label="Email"
            type="email"
            placeholder="Enter your email"
            icon="email"
            name = "email"
            formValue={formData.email}
            onChange={handleChange}
          />
          <FormInput
            label="Phone Number"
            type="tel"
            placeholder="Enter your phone number"
            icon="phone"
            name = "phoneNumber"
            formValue={formData.phoneNumber}
            onChange={handleChange}
          />
          <FormInput
            label="Password"
            type="password"
            placeholder="Create a password"
            icon="password"
            name = "password"
            formValue={formData.password}
            onChange={handleChange}
          />
          <p className="hint">Must be at least 8 characters.</p>
          <FormInput
            label="Confirm Password"
            type="password"
            placeholder="Confirm your password"
            icon="password"
          />
          <button className="register-button" onClick={handleRegister}>Create account</button>
          <p className="login-link">
            Already have an account? <Link href="/login">Log In</Link>
          </p>
        </div>
      </div>

      {/* Right: Welcome Section */}
      <div className="login-image">
          <div className="overlay"></div>
          <div className="text-container">
            <h2 className="text-white">Welcome Here</h2>
            <p className="text-white small-text">
              Create an account
            </p>
          </div>
        </div>
    </div>
  );
}