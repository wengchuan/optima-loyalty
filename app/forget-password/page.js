'use client'; // Enable client-side interactions

import { useState, useEffect } from 'react';
import Link from 'next/link'; // Import Link from next/link
import './forgetPass.css'; // Assuming you have this CSS file in the same folder
import FormInput from "../../components/FormInput";
import { redirect } from 'next/dist/server/api-utils';
import { useRouter } from 'next/navigation';


export default function ForgetPassword() {

  const [error, setError] = useState('');
  const router = useRouter();

  const [formData , setFormData] = useState({
    email:'',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    // Simple validation
    if (!formData.email) {
      setError('Please fill out all fields.');
      return;
    }
    else{
      try{
        const response = await fetch("http://localhost:8080/api/users/reset-password-request", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json", // Ensure the correct content type
      },
        body: JSON.stringify( formData ),
    })
    if (!response.ok) {
      throw new Error("Failed");
  }else{
    alert(
      "An email will Send to your email"
    );
    router.push('/login')

  }


  const data = await response.json();
  console.log("successful:", data);
 
  return data;
} catch (error) {
  console.log("Error forget password in:", error.message);
}
    }

    
    // Reset error
    setError('');

  };

  const handleCredentialResponse = (response) => {
    console.log('Encoded JWT ID token:', response.credential);
    // Handle token for authentication, send it to the server, etc.
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
  
  
          <button className="login-button" onClick={handleLogin}>Change Password</button>
          
     
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

