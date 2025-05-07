"use client";

import Link from "next/link";
import { useRouter,useSearchParams } from "next/navigation";
import { useCart } from "../../context/CartContext";
import { useState, useEffect } from "react";
import "./Checkout.css";

export default function Checkout() {
  const searchParams = useSearchParams();
  const voucherCode = searchParams.get("voucherCode");
  const updatedPoints = searchParams.get("updatedPoints");

  const { cart, clearCart } = useCart();
  const router = useRouter();

  // State for user details and addresses
  const [addresses, setAddresses] = useState([]);
  const [pointsBalance, setPointsBalance] = useState(0);
  const [selectedAddressIndex, setSelectedAddressIndex] = useState(0); // Default to first address
  const [showModal, setShowModal] = useState(false);
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

      const user = await response.json();

      // Populate addresses and points balance
      setAddresses([
        {
          name: user.username,
          address: user.address,
          phone: user.phoneNumber,
        },
      ]);
      setPointsBalance(user.points);
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  // Calculate total points (excluding redeemed items)
  const totalPoints = cart.reduce((total, item) => {
    const itemPrice = item.isRedeemed ? 0 : item.price;
    return total + itemPrice * item.quantity;
  }, 0);

  // Handle placing the order
  const handlePlaceOrder = async () => {
    try {
      // Step 1: Redeem the voucher
      if (voucherCode) {
        const redeemResponse = await fetch(`http://localhost:8080/api/voucherCode/redeem/${voucherCode}`, {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!redeemResponse.ok) {
          const errorMessage = await redeemResponse.text();
          alert(`Failed to redeem voucher: ${errorMessage}`);
          return;
        }

        alert("Voucher redeemed successfully!");
      }

      // Step 2: Fetch cart items
      const cartResponse = await fetch("http://localhost:8080/api/cart/", {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!cartResponse.ok) {
        throw new Error("Failed to fetch cart items for checkout.");
      }

      const cartItems = await cartResponse.json();

      // Step 3: Call the checkout API
      const checkoutResponse = await fetch("http://localhost:8080/api/checkout/", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(cartItems),
      });

      if (!checkoutResponse.ok) {
        throw new Error("Failed to complete checkout.");
      }

      const checkoutResult = await checkoutResponse.json();

    // Step 4: Navigate to the order confirmation page with the response
    const encodedData = encodeURIComponent(JSON.stringify(checkoutResult));
    router.push(`/orderconfirmation?data=${encodedData}`);

      // Clear the cart
      // clearCart();
    } catch (error) {
      console.error("Error during checkout:", error);
      alert(error.message || "An error occurred during checkout.");
    }
  };

  // Fetch user details on page load
  useEffect(() => {
    fetchUserDetails();
  }, []);

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
            {addresses.length > 0 ? (
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
                  </label>
                </div>
              ))
            ) : (
              <p>Loading addresses...</p>
            )}
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
            <button className="place-order-button" onClick={handlePlaceOrder}>
              Place order
            </button>
          </section>
        </div>
      </div>
    </div>
  );
}