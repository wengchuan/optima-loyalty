"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import "../account/Account.css"; // Reuse Account.css for sidebar styling
import "./Orders.css";

export default function Orders() {
  const [user, setUser] = useState({
    fullName: "",
    pointsBalance: 0,
  });

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUserDetails = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/users/user_info", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch user details");
      }

      const userData = await response.json();

      const updatedUser = {
        fullName: userData.username || "",
        pointsBalance: userData.points || 0,
      };

      setUser(updatedUser);
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/checkout/cart_history", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch orders");
      }

      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setError(error.message || "An error occurred while fetching orders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserDetails();
    fetchOrders();
  }, []);

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
            <Link href="/account">My Account</Link>
            <Link href="/orders" className="active">
              Orders
            </Link>
            <Link href="/points-history">Points History</Link>
          </nav>
        </aside>
        <main className="main-content">
          <h1>Orders</h1>
          <section className="orders-section">
            <h3>Your Orders</h3>
            {loading ? (
              <p>Loading orders...</p>
            ) : error ? (
              <p className="error-message">{error}</p>
            ) : orders.length === 0 ? (
              <p>No orders found.</p>
            ) : (
              <table className="orders-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Date</th>
                    <th>Item</th>
                    <th>Quantity</th>
                    <th>Points</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id}>
                      <td>{order.id}</td>
                      <td>{new Date(order.completed_date).toLocaleDateString()}</td>
                      <td>{order.voucher.title}</td>
                      <td>{order.quantity}</td>
                      <td>{order.voucher.points.toLocaleString()} Points</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}