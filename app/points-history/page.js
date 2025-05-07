"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import "../account/Account.css"; // Reuse Account.css for sidebar styling
import "./PointsHistory.css";

export default function PointsHistory() {
  // State for user data
  const [user, setUser] = useState({
    fullName: "",
    pointsBalance: 0,
  });

  // State for points history
  const [pointsHistory, setPointsHistory] = useState([]);
  const [loading, setLoading] = useState(true); // State to manage loading state
  const [error, setError] = useState(null); // State to manage errors

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

      // Update user state with the fetched data
      setUser({
        fullName: userData.username || "",
        pointsBalance: userData.points || 0,
      });
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  // Fetch points history from the API
  const fetchPointsHistory = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/checkout/cart_history", {
        method: "POST",
        credentials: "include", // Include cookies for authentication
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch points history");
      }

      const data = await response.json();

      // Transform the data to match the points history format
      const transformedData = data.map((item) => ({
        id: item.id,
        date: new Date(item.completed_date).toLocaleDateString(),
        description: item.voucher.title,
        points: -item.voucher.points * item.quantity, // Negative points for redeemed items
      }));

      setPointsHistory(transformedData);
    } catch (error) {
      console.error("Error fetching points history:", error);
      setError(error.message || "An error occurred while fetching points history.");
    } finally {
      setLoading(false); // Set loading to false after the API call
    }
  };

  // Fetch user details and points history when the page loads
  useEffect(() => {
    fetchUserDetails();
    fetchPointsHistory();
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
            <Link href="/orders">Orders</Link>
            <Link href="/points-history" className="active">
              Points History
            </Link>
          </nav>
        </aside>
        <main className="main-content">
          <h1>Points History</h1>
          <section className="points-history-section">
            <h3>Your Points History</h3>
            {loading ? (
              <p>Loading points history...</p>
            ) : error ? (
              <p className="error-message">{error}</p>
            ) : pointsHistory.length === 0 ? (
              <p>No points history found.</p>
            ) : (
              <table className="points-history-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Description</th>
                    <th>Points</th>
                  </tr>
                </thead>
                <tbody>
                  {pointsHistory.map((entry) => (
                    <tr key={entry.id}>
                      <td>{entry.date}</td>
                      <td>{entry.description}</td>
                      <td className={entry.points >= 0 ? "positive" : "negative"}>
                        {entry.points > 0 ? "+" : ""}
                        {entry.points}
                      </td>
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