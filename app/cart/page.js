"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useCart } from "../../context/CartContext";
import { useRouter } from "next/navigation"; // Import useRouter from Next.js
import "./Cart.css";

export default function Cart() {
  const router = useRouter(); // Initialize router
  const { removeFromCart, updateQuantity } = useCart();
  const [cartLoading, setCartLoading] = useState(false);
  const [cart, setCart] = useState([]);
  const [voucherCode, setVoucherCode] = useState("");
  const [voucherMessage, setVoucherMessage] = useState("");
  const [voucherApplied, setVoucherApplied] = useState(false);

  // Function to fetch Cart from API
  const fetchCart = async () => {
    setCartLoading(true);
    try {
      const response = await fetch("http://localhost:8080/api/cart/", {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Error fetching Cart: ${response.status}`);
      }

      const data = await response.json();
      setCart(data); // Update the `cart` state from `useCart`
    } catch (error) {
      console.error("Failed to fetch Cart:", error);
    } finally {
      setCartLoading(false);
    }
  };
  // Handle Apply Voucher
  const handleApplyVoucher = async () => {
    if (!voucherCode.trim()) {
      setVoucherMessage("Please enter a voucher code.");
      return;
    }

    let isVoucherValid = false; // Flag to track if a match is found

    try {
      for (const item of cart) {
        const response = await fetch("http://localhost:8080/api/voucherCode/verify", {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            code: voucherCode,
            voucherId: item.voucher.id, // Check each item's voucher ID
          }),
        });

        if (response.ok) {
          const message = await response.text();
          setVoucherMessage(message); // Set success message
          setVoucherApplied(true); // Mark voucher as applied
          isVoucherValid = true; // Mark as valid

          // Deduct points for the matched item
          setCart((prevCart) =>
            prevCart.map((cartItem) =>
              cartItem.voucher.id === item.voucher.id
                ? { ...cartItem, isRedeemed: true } // Mark as redeemed
                : cartItem
            )
          );

          break; // Exit the loop once a match is found
        }
      }

      if (!isVoucherValid) {
        throw new Error("No matching voucher found in the cart.");
      }
    } catch (error) {
      console.error("Error applying voucher:", error);
      setVoucherMessage(error.message || "Failed to apply voucher.");
      setVoucherApplied(false); // Mark voucher as not applied
    }
  };

  // Handle increment quantity
  const handleIncrement = (cartcartId, currentQuantity) => {
    handleQuantity(cartcartId, currentQuantity + 1);
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.voucher.id === cartcartId ? { ...item, quantity: currentQuantity + 1 } : item
      )
    );
  };

  // Handle decrement quantity
  const handleDecrement = (cartcartId, currentQuantity) => {
    handleQuantity(cartcartId, currentQuantity - 1);
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.voucher.id === cartcartId ? { ...item, quantity: currentQuantity - 1 } : item
      )
    );
  };

  const handleQuantity = async (cartcartId, currentQuantity) => {
    try {
      const response = await fetch("http://localhost:8080/api/cart/update", {
        method: "POST",
        credentials: "include", // Ensures httpOnly cookies are included
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ voucherId: cartcartId, quantity: currentQuantity }), // Assuming voucher has an 'id' property
      });

      if (!response.ok) {
        throw new Error(`Failed to add voucher to cart: ${response.status}`);
      }

      const data = await response.json();
    } catch (error) {
      console.error("Error adding voucher to cart:", error);
      alert("Failed to add voucher to cart. Please try again.");
    }
  };

  // Handle delete cart
  const handleDelete = async (cartcartId) => {
    try {
      const response = await fetch("http://localhost:8080/api/cart/delete", {
        method: "POST",
        credentials: "include", // Ensures httpOnly cookies are included
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: cartcartId }), // Assuming voucher has an 'id' property
      });

      if (!response.ok) {
        throw new Error(`Failed to delete cart: ${response.status}`);
      }

      //const data = await response.json();
      alert("cart removed from cart!");
      setCart((prevCart) => prevCart.filter((item) => item.id !== cartcartId)); // Update the cart state
    } catch (error) {
      console.error("Error adding voucher to cart:", error);
      alert("Failed to add voucher to cart. Please try again.");
    }
  };

  const totalPoints = cart.reduce((total, item) => {
    const itemPrice = item.isRedeemed ? 0 : item.voucher.points; // If redeemed, price is 0
    return total + itemPrice * item.quantity;
  }, 0);

  // Handle Checkout
  const handleCheckout = () => {
    if (cart.length === 0) {
      alert("Your cart is empty. Add items before checking out.");
      return;
    }

    // Navigate to the checkout page and pass cart data
    router.push(
     "/checkout",
       // Pass cart data as a query parameter
  );
  };

  useEffect(() => {
    fetchCart();
  }, []);

  return (
    <div className="cart-page-container">
      {/* Breadcrumb */}
      <nav className="breadcrumb">
        <Link href="/home">Home</Link> &gt; <span>Cart</span>
      </nav>

      {/* Cart Title */}
      <h1 className="cart-title">Cart</h1>

      {cart.length === 0 ? (
        <p className="empty-cart-message">
          Your cart is empty. <Link href="/shop">Go shopping!</Link>
        </p>
      ) : (
        <div className="cart-content">
          {/* Cart Items Table */}
          <div className="cart-table">
            {/* Table Header */}
            <div className="cart-table-header">
              <div className="header-item">Product</div>
              <div className="header-item">Points</div>
              <div className="header-item">Quantity</div>
              <div className="header-item">Subtotal</div>
            </div>

            {/* Table Rows */}
            {cart.map((item) => (
              <div key={item.id} className="cart-table-row">
                {/* Product Column */}
                <div className="cart-table-cell product-cell">
                  <img src={"http://localhost:8080" + item.voucher.image} alt={item.voucher.title} className="cart-item-image" />
                  <span>{item.voucher.title}</span>
                  {item.isRedeemed && <span className="redeemed-label"> (Redeemed)</span>}
                </div>

                {/* Price Column */}
                <div className="cart-table-cell">
                  {item.isRedeemed ? "0" : item.voucher.points}.00 Points
                </div>

                {/* Quantity Column */}
                <div className="cart-table-cell quantity-cell">
                  <div className="quantity-controls">
                    <button
                      className="quantity-btn"
                      onClick={() => handleDecrement(item.voucher.id, item.quantity)}
                    >
                      -
                    </button>
                    <span className="quantity">{item.quantity}</span>
                    <button
                      className="quantity-btn"
                      onClick={() => handleIncrement(item.voucher.id, item.quantity)}
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Subtotal Column */}
                <div className="cart-table-cell">
                  {item.isRedeemed
                    ? "0"
                    : (item.voucher.points * item.quantity)}.00 Points
                </div>
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(item.id)}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>

          {/* Cart Totals Section */}
          <div className="cart-totals">
            <h2 className="cart-totals-title">Cart Totals</h2>
            <div className="totals-row">
              <span>Subtotal</span>
              <span>{totalPoints}.00 Points</span>
            </div>
            <div className="totals-row">
              <span>Total</span>
              <span className="total-amount">{totalPoints}.00 Points</span>
            </div>

            {/* Voucher Code Input */}
            <div className="voucher-section">
              <label htmlFor="voucher-code">Voucher Code</label>
              <div className="voucher-input-container">
                <input
                  type="text"
                  id="voucher-code"
                  value={voucherCode}
                  onChange={(e) => setVoucherCode(e.target.value)}
                  placeholder="Enter voucher code"
                  disabled={voucherApplied}
                />
                <button
                  className="apply-voucher-btn"
                  onClick={handleApplyVoucher}
                  disabled={voucherApplied}
                >
                  Apply
                </button>
              </div>
              {voucherMessage && (
                <p className={`voucher-message ${voucherApplied ? "success" : "error"}`}>
                  {voucherMessage}
                </p>
              )}
            </div>

            <button className="checkout-btn" onClick={handleCheckout}>
              Check Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}