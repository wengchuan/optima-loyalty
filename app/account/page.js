"use client";

import Link from "next/link";
import Header from "../../components/Header"; // Adjusted path for app router
import "./Account.css";
import { useState } from "react";

export default function Account() {
  // Initial user data
  const [user, setUser] = useState({
    fullName: "Elnaz Bolkhari",
    email: "elnazbolkhari@gmail.com",
    phone: "+80123456789",
    password: "********",
    language: "English",
    pointsBalance: 10000,
  });

  // State to manage which field is being edited
  const [editingField, setEditingField] = useState(null);

  // State to manage form data while editing
  const [formData, setFormData] = useState({ ...user });

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
  const handleSave = () => {
    setUser({ ...formData }); // Update user data with form data
    setEditingField(null); // Exit editing mode
    // In a real app, you’d send the updated data to an API here
    console.log("Updated user data:", formData);
  };

  return (
    <div className="account-page">
      <div className="account-container">
        <aside className="sidebar">
          <div className="user-info">
            <div className="avatars">EB</div>
            <h2>{user.fullName}</h2>
            <span className="points-balance">
              Points Balance {user.pointsBalance.toLocaleString()}
            </span>
          </div>
          <nav className="sidebar-nav">
            <Link href="/account" className="active">
              My Account
            </Link>
            <Link href="/orders">Orders</Link>
            <Link href="/points-history">Points History</Link>
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
              <label>Language</label>
              <input
                type="text"
                value={formData.language}
                readOnly={editingField !== "language"}
                onChange={(e) => handleInputChange(e, "language")}
              />
              <span
                className="edit-icon"
                onClick={() => handleEditClick("language")}
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