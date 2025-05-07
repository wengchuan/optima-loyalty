"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import "./OrderConfirmation.css";

export default function OrderConfirmation() {
  const searchParams = useSearchParams();
  const data = JSON.parse(decodeURIComponent(searchParams.get("data")));

  // Calculate subtotal and total
  const subtotal = data.reduce((sum, item) => sum + item.voucher.points * item.quantity, 0);
  const total = subtotal; // Assuming no additional fees or discounts

  return (
    <div className="confirmation-page">
      <nav className="breadcrumb">
        <Link href="/home">Home</Link> &gt; <Link href="/checkout">Checkout</Link>
      </nav>
      <h1 className="confirmation-title">YOUR ORDER IS CONFIRMED!</h1>
      <div className="confirmation-content">
        <div className="order-items">
          <div className="order-header">
            <span>Product</span>
            <span>Price</span>
            <span>Quantity</span>
            <span>Subtotal</span>
          </div>
          {data.map((item, index) => (
            <div key={index} className="order-item">
              <div className="item-details">
                <img
                  src={"http://localhost:8080" + item.voucher.image}
                  alt={item.voucher.title}
                  className="item-image"
                />
                <span>{item.voucher.title}</span>
              </div>
              <span>{item.voucher.points} Points</span>
              <span>{item.quantity}</span>
              <span>{(item.voucher.points * item.quantity).toLocaleString()} Points</span>
            </div>
          ))}
        </div>
        <div className="order-summary">
          <h2>Order ID: {data[0].id}</h2>
          <h3>TOTALS</h3>
          <div className="summary-row">
            <span>Subtotal</span>
            <span>{subtotal.toLocaleString()} Points</span>
          </div>
          <div className="summary-row total">
            <span>Total</span>
            <span>{total.toLocaleString()} Points</span>
          </div>
        </div>
      </div>
    </div>
  );
}