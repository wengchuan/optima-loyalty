"use client";

import Link from "next/link";
import Header from "../../components/Header";
import "../account/Account.css"; // Reuse Account.css for sidebar styling
import "./PointsHistory.css";

export default function PointsHistory() {
  // Placeholder user data (same as account page)
  const user = {
    fullName: "Elnaz Bolkhari",
    pointsBalance: 10000,
  };

  // Placeholder points history data
  const pointsHistory = [
    { id: 1, date: "2025-04-10", description: "Redeemed Smartphone", points: -500 },
    { id: 2, date: "2025-03-15", description: "Earned from Purchase", points: 200 },
    { id: 3, date: "2025-02-20", description: "Bonus Points", points: 150 },
  ];

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
            {pointsHistory.length === 0 ? (
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
                        {entry.points > 0 ? "+" : ""}{entry.points}
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