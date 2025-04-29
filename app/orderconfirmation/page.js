"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import "./OrderConfirmation.css";

export default function OrderConfirmation() {
  const searchParams = useSearchParams();
  const state = searchParams.get("state");

  // Parse the orderDetails from the query parameter with error handling
  let orderDetails;
  try {
    orderDetails = state
      ? JSON.parse(decodeURIComponent(state))
      : {
          orderId: "HJ38938BUIO",
          items: [
            {
              name: "Lenovo 27\" Monitor",
              price: 2500,
              quantity: 1,
              subtotal: 2500,
              image: "/image/lenovo.jpeg",
            },
          ],
          subtotal: 2500,
          total: 2500,
        };
  } catch (error) {
    console.error("Failed to parse orderDetails:", error);
    orderDetails = {
      orderId: "HJ38938BUIO",
      items: [
        {
          name: "Lenovo 27\" Monitor",
          price: 2500,
          quantity: 1,
          subtotal: 2500,
          image: "/image/lenovo.jpeg",
        },
      ],
      subtotal: 2500,
      total: 2500,
    };
  }

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
          {orderDetails.items.map((item, index) => (
            <div key={index} className="order-item">
              <div className="item-details">
                <img src={item.image} alt={item.name} className="item-image" />
                <span>{item.name}</span>
              </div>
              <span>{item.price.toLocaleString()}.00 Points</span>
              <span>{item.quantity}</span>
              <span>RM {item.subtotal.toLocaleString()}.00</span>
            </div>
          ))}
        </div>
        <div className="order-summary">
          <h2>Order ID: {orderDetails.orderId}</h2>
          <h3>TOTALS</h3>
          <div className="summary-row">
            <span>Subtotal</span>
            <span>{orderDetails.subtotal.toLocaleString()}.00 Points</span>
          </div>
          <div className="summary-row total">
            <span>Total</span>
            <span>{orderDetails.total.toLocaleString()}.00 Points</span>
          </div>
        </div>
      </div>
    </div>
  );
}