"use client";

import Link from "next/link";
import Header from "../../components/Header"; // Adjusted path for app router
import "./Account.css";
import { useState, useEffect } from "react";

export default function Account() {
  // Initial user data
  const [user, setUser] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    address: "",
    aboutMe: "",
    pointsBalance: 0,
  });

  // State to manage which field is being edited
  const [editingField, setEditingField] = useState(null);

  // State to manage form data while editing
  const [formData, setFormData] = useState({ ...user });

  // Fetch user details from the API
  const fetchUserDetails = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/users/user_info", {
        method: "POST",
        credentials: "include", // Include cookies for authentication
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch user details");
      }

      const userData = await response.json();

      // Update user and form data with the API response
      const updatedUser = {
        fullName: userData.username || "",
        email: userData.email || "",
        phone: userData.phoneNumber || "",
        password: "********", // Masked password
        address: userData.address || "",
        aboutMe: userData.aboutMe || "",
        pointsBalance: userData.points || 0,
      };

      setUser(updatedUser);
      setFormData(updatedUser);
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  // Call fetchUserDetails when the page loads
  useEffect(() => {
    fetchUserDetails();
  }, []);

  // Handle edit icon click to enable editing for a specific field
  const handleEditClick = (field) => {
    setEditingField(field);
  };

  // Handle input change while editing
  const handleInputChange = (e, field) => {
    setFormData({
      ...formData,
      [field]: e.target.value,
    });
  };

  // Handle save button click to update user data
  const handleSave = async () => {
    try {
      // Send the updated formData to the API
      const response = await fetch("http://localhost:8080/api/users/update", {
        method: "POST", // Use POST or PUT based on your API design
        credentials: "include", // Include cookies for authentication
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: formData.fullName,
          email: formData.email,
          phoneNumber: formData.phone,
          password: formData.password === "********" ? undefined : formData.password, // Only send password if it's updated
          address: formData.address,
          aboutMe: formData.aboutMe,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update user details");
      }

      // Since the server responds with no body, skip parsing the response
      // Update the user state with the current formData
      setUser({ ...formData, password: "********" }); // Mask the password
      setEditingField(null); // Exit editing mode
      alert("User details updated successfully!");
       // Refresh the page
    window.location.reload();
    } catch (error) {
      console.error("Error updating user details:", error);
      alert(error.message || "An error occurred while updating user details.");
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/auth/logout", {
        method: "POST",
        credentials: "include", // Include cookies for authentication
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to log out");
      }

      alert("You have been logged out successfully.");
      window.location.href = "/login"; // Redirect to the login page
    } catch (error) {
      console.error("Error logging out:", error);
      alert("An error occurred while logging out. Please try again.");
    }
  };

  return (
    <div className="account-page">
      <div className="account-container">
        <aside className="sidebar">
          <div className="user-info">
            <div className="avatars">{user.fullName.charAt(0).toUpperCase()}</div>
            <h2>{user.fullName}</h2>
            <span className="points-balance">
              Points Balance {user.pointsBalance.toLocaleString()}
            </span>
          </div>
          <nav className="sidebar-nav">
            <Link href="/account" className="active">
              My Account
            </Link>
            <Link
              href={{
                pathname: "/orders",
                query: {
                  fullName: user.fullName,
                  pointsBalance: user.pointsBalance,
                },
              }}
            >
              Orders
            </Link>
            <Link href="/points-history">Points History</Link>
            <button className="logout-button" onClick={handleLogout}>
              Logout
            </button>
          </nav>
        </aside>
        <main className="main-content">
          <h1>Profile</h1>
          <section className="personal-details">
            <h3>Personal Details</h3>
            <div className="detail-item">
              <label>Full Name</label>
              <input
                type="text"
                value={formData.fullName}
                readOnly={editingField !== "fullName"}
                onChange={(e) => handleInputChange(e, "fullName")}
              />
              <span
                className="edit-icon"
                onClick={() => handleEditClick("fullName")}
              >
                ✏️
              </span>
            </div>
            <div className="detail-item">
              <label>Email Address</label>
              <input
                type="email"
                value={formData.email}
                readOnly={editingField !== "email"}
                onChange={(e) => handleInputChange(e, "email")}
              />
              <span
                className="edit-icon"
                onClick={() => handleEditClick("email")}
              >
                ✏️
              </span>
            </div>
            <div className="detail-item">
              <label>Phone</label>
              <input
                type="tel"
                value={formData.phone}
                readOnly={editingField !== "phone"}
                onChange={(e) => handleInputChange(e, "phone")}
              />
              <span
                className="edit-icon"
                onClick={() => handleEditClick("phone")}
              >
                ✏️
              </span>
            </div>
            <div className="detail-item">
              <label>Password</label>
              <input
                type="password"
                value={formData.password}
                readOnly={editingField !== "password"}
                onChange={(e) => handleInputChange(e, "password")}
              />
              <span
                className="edit-icon"
                onClick={() => handleEditClick("password")}
              >
                ✏️
              </span>
            </div>
            <div className="detail-item">
              <label>Address</label>
              <input
                type="text"
                value={formData.address}
                readOnly={editingField !== "address"}
                onChange={(e) => handleInputChange(e, "address")}
              />
              <span
                className="edit-icon"
                onClick={() => handleEditClick("address")}
              >
                ✏️
              </span>
            </div>
            <div className="detail-item">
              <label>About Me</label>
              <textarea
                value={formData.aboutMe}
                readOnly={editingField !== "aboutMe"}
                onChange={(e) => handleInputChange(e, "aboutMe")}
              />
              <span
                className="edit-icon"
                onClick={() => handleEditClick("aboutMe")}
              >
                ✏️
              </span>
            </div>
            <button className="save-button" onClick={handleSave}>
              Save My Details
            </button>
          </section>
        </main>
      </div>
    </div>
  );
}