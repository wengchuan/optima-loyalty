"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "../../context/CartContext";
import { useUser } from "../../context/UserContext";
import { useState } from "react";
import "./Checkout.css";

export default function Checkout() {
  const { cart, clearCart } = useCart();
  const { pointsBalance, deductPoints, addresses, addAddress, updateAddress } = useUser();
  const router = useRouter();

  // State for the modal and form
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [selectedAddressIndex, setSelectedAddressIndex] = useState(0); // Default to first address
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    companyName: "",
    country: "Malaysia",
    streetAddress: "",
    townCity: "",
    state: "Melaka",
    zipCode: "",
    phone: "",
    email: "",
    additionalInfo: "",
    agreeTerms: false,
  });

  // Calculate total points (excluding redeemed items)
  const totalPoints = cart.reduce((total, item) => {
    const itemPrice = item.isRedeemed ? 0 : item.price;
    return total + itemPrice * item.quantity;
  }, 0);

  // Open modal for adding a new address
  const openAddModal = () => {
    setIsEditing(false);
    setFormData({
      firstName: "",
      lastName: "",
      companyName: "",
      country: "Malaysia",
      streetAddress: "",
      townCity: "",
      state: "Melaka",
      zipCode: "",
      phone: "",
      email: "",
      additionalInfo: "",
      agreeTerms: false,
    });
    setShowModal(true);
  };

  // Open modal for editing an existing address
  const openEditModal = (index) => {
    const address = addresses[index];
    const [firstName, lastName] = address.name.split(" ");
    const addressParts = address.address.split(", ");
    setFormData({
      firstName: firstName || "",
      lastName: lastName || "",
      companyName: "",
      country: addressParts[addressParts.length - 1] || "Malaysia",
      streetAddress: addressParts[0] || "",
      townCity: addressParts[1] || "",
      state: addressParts[2] || "Melaka",
      zipCode: addressParts[addressParts.length - 2] || "",
      phone: address.phone || "",
      email: "",
      additionalInfo: "",
      agreeTerms: false,
    });
    setIsEditing(true);
    setEditIndex(index);
    setShowModal(true);
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.agreeTerms) {
      alert("Please agree to the terms and conditions.");
      return;
    }

    const newAddress = {
      name: `${formData.firstName} ${formData.lastName}`.trim(),
      address: `${formData.streetAddress}, ${formData.townCity}, ${formData.state}, ${formData.zipCode}, ${formData.country}`,
      phone: formData.phone,
    };

    if (isEditing) {
      updateAddress(editIndex, newAddress);
    } else {
      addAddress(newAddress);
      setSelectedAddressIndex(addresses.length); // Select the newly added address
    }

    setShowModal(false);
  };

  // Handle placing the order
  const handlePlaceOrder = () => {
    if (pointsBalance < totalPoints) {
      alert(
        `Insufficient points! You need ${totalPoints} points, but you only have ${pointsBalance} points.`
      );
      return;
    }

    const success = deductPoints(totalPoints);
    if (success) {
      const orderId = `HJ${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
      const orderDetails = {
        orderId,
        items: cart.map((item) => ({
          name: item.name,
          price: item.isRedeemed ? 0 : item.price,
          quantity: item.quantity,
          subtotal: item.isRedeemed ? 0 : item.price * item.quantity,
          image: item.image || "/image/placeholder.jpg",
        })),
        subtotal: totalPoints,
        total: totalPoints,
      };

      clearCart();
      const state = encodeURIComponent(JSON.stringify(orderDetails));
      router.push(`/order-confirmation?state=${state}`);
    } else {
      alert("Failed to place order. Please try again."); // Fixed typo
    }
  };

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        <nav className="breadcrumb">
          <Link href="/home">Home</Link> &gt; <span>Checkout</span>
        </nav>
        <h1>Checkout</h1>
        <div className="checkout-content">
          <section className="billing-details">
            <h2>Billing details</h2>
            <button className="add-address-button" onClick={openAddModal}>
              Add new address
            </button>
            {addresses.length > 0 ? ( // Added fallback for empty addresses
              addresses.map((address, index) => (
                <div key={index} className="address">
                  <input
                    type="radio"
                    id={`address${index}`}
                    name="address"
                    checked={selectedAddressIndex === index}
                    onChange={() => setSelectedAddressIndex(index)}
                  />
                  <label htmlFor={`address${index}`}>
                    {address.name}, {address.address}, {address.phone}
                    <span className="edit-icon" onClick={() => openEditModal(index)}>
                      ✏️
                    </span>
                  </label>
                </div>
              ))
            ) : (
              <p>No addresses available. Please add an address.</p>
            )}
            <div className="checkbox">
              <input type="checkbox" id="billing-delivery-same" defaultChecked />
              <label htmlFor="billing-delivery-same">
                My billing and delivery information are the same.
              </label>
            </div>
          </section>
          <section className="order-summary">
            <h2>Product</h2>
            {cart.map((item, index) => (
              <div key={index} className="order-item">
                <span>
                  {item.name} x{item.quantity}
                  {item.isRedeemed && <span className="redeemed-label"> (Redeemed)</span>}
                </span>
                <span>
                  {item.isRedeemed
                    ? "0"
                    : (item.price * item.quantity).toLocaleString()}.00 Points
                </span>
              </div>
            ))}
            <div className="subtotal">
              <span>Subtotal</span>
              <span>{totalPoints.toLocaleString()}.00 Points</span>
            </div>
            <div className="total">
              <span>Total</span>
              <span>{totalPoints.toLocaleString()}.00 Points</span>
            </div>
            <p className="privacy-notice">
              Your personal data will be used to support your experience throughout
              this website, to manage access to your account, and for other purposes
              described in our privacy policy.
            </p>
            <button className="place-order-button" onClick={handlePlaceOrder}>
              Place order
            </button>
          </section>
        </div>
      </div>

      {/* Modal for Add/Edit Address */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>{isEditing ? "Edit Address" : "Add new address"}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="firstName">First Name</label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="lastName">Last Name</label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="companyName">Company Name (optional)</label>
                <input
                  type="text"
                  id="companyName"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="country">Country / Region</label>
                <select
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  required
                >
                  <option value="Malaysia">Malaysia</option>
                  <option value="Japan">Japan</option>
                  <option value="Korea">Korea</option>
                  <option value="Indonesia">Indonesia</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="streetAddress">Street Address</label>
                <input
                  type="text"
                  id="streetAddress"
                  name="streetAddress"
                  value={formData.streetAddress}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="townCity">Town / City</label>
                <input
                  type="text"
                  id="townCity"
                  name="townCity"
                  value={formData.townCity}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="state">State</label>
                <select
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  required
                >
                  <option value="Melaka">Melaka</option>
                  <option value="Kuala Lumpur">Kuala Lumpur</option>
                  <option value="Selangor">Selangor</option>
                  <option value="Sabah">Sabah</option>
                  <option value="Sarawak">Sarawak</option>
                  <option value="Johor">Johor</option>
                  <option value="Kedah">Kedah</option>
                  <option value="Perak">Perak</option>
                  <option value="Perlis">Perlis</option>
                  <option value="Kelantan">Kelantan</option>
                  <option value="Terengganu">Terengganu</option>
                  <option value="Pahang">Pahang</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="zipCode">ZIP Code</label>
                <input
                  type="text"
                  id="zipCode"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="phone">Phone</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="additionalInfo">Additional Information</label>
                <textarea
                  id="additionalInfo"
                  name="additionalInfo"
                  value={formData.additionalInfo}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group checkbox">
                <input
                  type="checkbox"
                  id="agreeTerms"
                  name="agreeTerms"
                  checked={formData.agreeTerms}
                  onChange={handleInputChange}
                />
                <label htmlFor="agreeTerms">
                  I accept within 1 working day.{" "}
                  <a href="/terms" target="_blank">
                    Read the T&Cs
                  </a>
                </label>
              </div>
              <div className="modal-buttons">
                <button type="button" className="close-btn" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="save-btn">
                  Save Shipping Information
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}