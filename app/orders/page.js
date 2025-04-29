"use client";

import Link from "next/link";
import "../account/Account.css"; // Reuse Account.css for sidebar styling
import "./Orders.css";

export default function Orders() {
  // Placeholder user data (same as account page)
  const user = {
    fullName: "Elnaz Bolkhari",
    pointsBalance: 10000,
  };

  // Placeholder orders data
  const orders = [
    { id: 1, date: "2025-04-10", item: "Smartphone", status: "Delivered" },
    { id: 2, date: "2025-03-15", item: "Laptop", status: "Shipped" },
    { id: 3, date: "2025-02-20", item: "Printer", status: "Processing" },
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
            {orders.length === 0 ? (
              <p>No orders found.</p>
            ) : (
              <table className="orders-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Date</th>
                    <th>Item</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id}>
                      <td>{order.id}</td>
                      <td>{order.date}</td>
                      <td>{order.item}</td>
                      <td>{order.status}</td>
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