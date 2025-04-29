"use client";

import Link from "next/link";
import { useEffect,useState } from "react";
import { useCart } from "../../context/CartContext";
import { useRouter } from "next/navigation";
import Voucher from "../../components/voucher/voucher";
import { useUser } from "../../context/UserContext"; // Import the useUser hook
import "./Home.css";

export default function Home() {
  const { fetchPoints } = useUser(); // Get fetchPoints from UserContext
  const { addToCart } = useCart();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [visibleVouchers, setVisibleVouchers] = useState(4); // Initially show 4 vouchers
  const [vouchers, setVouchers] = useState([]);
  const [vouchersLoading, setVouchersLoading] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [agreeTerms, setAgreeTerms] = useState(false);
// Function to check authentication status
const checkAuthentication = async () => {
  try {
    const response = await fetch("http://localhost:8080/api/users/validate", {
      method: "GET",
      credentials: "include", // Ensures httpOnly cookies are included
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (response.ok && data.authenticated) {
      setIsAuthenticated(true);
      // Fetch vouchers once authenticated
      fetchVouchers();
    } else {
      setIsAuthenticated(false);
      router.push('/login'); // Redirect to login if not authenticated
    }
  } catch (error) {
    console.error("Authentication check failed:", error);
    setIsAuthenticated(false);
    router.push('/login');
  } finally {
    setLoading(false);
  }
};


  
 // Function to fetch vouchers from API
 const fetchVouchers = async () => {
  setVouchersLoading(true);
  try {
    // Using POST method as specified in your backend
    const response = await fetch("http://localhost:8080/api/voucher/", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),  // Add empty body for POST
    });

    if (!response.ok) {
      throw new Error(`Error fetching vouchers: ${response.status}`);
    }

    const data = await response.json();
    setVouchers(data);
  } catch (error) {
    console.error("Failed to fetch vouchers:", error);
    // If authentication error, handle appropriately
    if (error.message.includes("401")) {
      setIsAuthenticated(false);
      router.push('/login');
    }
  } finally {
    setVouchersLoading(false);
  }
};

const openRedeemModal = (voucher) => {
  setSelectedVoucher(voucher);
  setAgreeTerms(false);
  setShowTermsModal(true);
};


const handleAcceptTerms = async (selectedVoucher) => {
  if (agreeTerms) {
    try {
      const response = await fetch("http://localhost:8080/api/voucherCode/generate", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          voucherId: selectedVoucher.id,
        }),
      });

      if (!response.ok) {
        throw new Error(`Error generating voucher code: ${response.status}`);
      }

      // Process the response as a Blob (PDF file)
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      // Create a temporary link to download the PDF
      const link = document.createElement("a");
      link.href = url;
      link.download = `voucher-${selectedVoucher.id}.pdf`; // Set the file name
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Refresh points in the context
      await fetchPoints();

      setShowTermsModal(false);
      setShowSuccessModal(true);
    } catch (error) {
      console.error("Failed to generate voucher code:", error);
      if (error.message.includes("401")) {
        setIsAuthenticated(false);
        router.push("/login");
      }
    }
  } else {
    alert("Please agree to the redemption terms and policies.");
  }
};



  // Handle Add to Cart
  const handleAddToCart = async (voucher) => {
    try {
      const response = await fetch("http://localhost:8080/api/cart/add", {
        method: "POST",
        credentials: "include", // Ensures httpOnly cookies are included
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ voucherId: voucher.id, quantity:1 }), // Assuming voucher has an 'id' property
      });
  
      if (!response.ok) {
        throw new Error(`Failed to add voucher to cart: ${response.status}`);
      }
  
      const data = await response.json();
      alert(`${voucher.title} has been added to your cart!`);
    } catch (error) {
      console.error("Error adding voucher to cart:", error);
      alert("Failed to add voucher to cart. Please try again.");
    }
  };


  // Handle Show More
  const handleShowMore = () => {
    setVisibleVouchers((prev) => prev + 4); // Show 4 more vouchers
  };

  useEffect(() => {
    checkAuthentication();
  }, []);

  return (
    <div className="home-container">
      {/* Browse The Category Section */}
      <section className="category-section">
        <h2 className="section-title">Browse The Category</h2>
        <p className="section-subtitle">
          The best way to get the product you love.
        </p>
        <div className="category-grid">
          <Link href="/shop?category=mobile" className="category-link">
            <div className="category-card mobile">
              <img src="/image/mobile.jpeg" alt="Mobile" />
              <h3>Mobile</h3>
            </div>
          </Link>
          <Link href="/shop?category=computer" className="category-link">
            <div className="category-card computer">
              <img src="/image/computer.jpg" alt="Computer/Laptop" />
              <h3>Computer / Laptop</h3>
            </div>
          </Link>
          <Link href="/shop?category=electronic" className="category-link">
            <div className="category-card electronic">
              <img src="/image/pnter.jpeg" alt="Electronic Device" />
              <h3>Electronic Device</h3>
            </div>
          </Link>
        </div>
      </section>

      {/* Latest Voucher Section */}
      <section className="voucher-section">
        <h2 className="section-title">Latest Voucher</h2>
        <div className="voucher-grid">
        {vouchers.map((voucher, index) => (
              <Voucher key={index} product={voucher} handleAddToCart={handleAddToCart} openRedeemModal ={openRedeemModal} />
            ))}
        </div>
        {visibleVouchers < vouchers.length && (
          <button className="show-more" onClick={handleShowMore}>
            Show More
          </button>
        )}
      </section>

        {/* Terms & Conditions Modal */}
        {showTermsModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Redemption Terms and Policies</h3>
            <ul className="tnc-list">
              <li><b>Points Deduction:</b> {selectedVoucher.points} points will be deducted from your balance.</li>
              <li><b>Non-Refundable:</b> Points will not be returned once redemption is completed.</li>
              <li><b>Product Availability:</b> Subject to availability.</li>
              <li><b>Expiration:</b> Points must be valid and not expired.</li>
              <li><b>One-Time Use:</b> Each voucher is redeemable once.</li>
            </ul>
            <label className="checkbox-label">
              <input type="checkbox" checked={agreeTerms} onChange={(e) => setAgreeTerms(e.target.checked)} />
              I agree to the redemption terms and policies.
            </label>
            <div className="modal-buttons">
              <button
  className="accept-btn"
  onClick={() => handleAcceptTerms(selectedVoucher)}
>
  Accept
</button>
              <button className="close-btn" onClick={() => setShowTermsModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
       
    </div>
  );
}