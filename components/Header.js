"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUser } from "../context/UserContext"; // Adjust the path as needed
import "./Header.css";
import { FaCartShopping } from "react-icons/fa6";
import { FaSearch } from "react-icons/fa";
import SearchBox from "./searchBox";

export default function Header() {
  const pathname = usePathname();
  const { pointsBalance, loadingPoints } = useUser();

  const showPointsBalance =
    pathname === "/home" ||
    pathname === "/shop" ||
    pathname.startsWith("/product/") ||
    pathname === "/cart";

  return (
    <header className="header">
      <div className="logo">Optima Loyalty</div>
      <nav>
        <Link href="/home">Home</Link>
        <Link href="/shop">Shop</Link>
        <Link href="/about">About</Link>
        <Link href="/contact">Contact</Link>
      
        <div className="icons">
          
        <SearchBox />
          <span>👤</span>
          <Link href="/cart" className="cart-icon">
            <FaCartShopping size={24} />
          </Link>
        </div>
        {/* {showPointsBalance && (
          <div className="points-balance">
            <span>Points Balance:</span>
            <div className="points-amount">2,500</div>
          </div>
        )} */}
          <div className="user-points">
          {loadingPoints ? (
            <span>Loading points...</span>
          ) : (
            <span>Points: {pointsBalance}</span>
          )}
        </div>
      </nav>
    </header>
  );
}