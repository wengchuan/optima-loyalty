"use client";

// Import 'use' from React
import { useState, useEffect, use } from "react";
import Link from "next/link";
import { useCart } from "../../../context/CartContext";
import "./Product.css"; // Ensure this CSS file exists and is styled appropriately

export default function ProductDetail({ params }) {
  // Unwrap the params Promise using React.use()
  // This might cause the component to suspend until the params are resolved.
  const resolvedParams = use(params);
  const { id } = resolvedParams; // Extract id from the resolved params object
  // Or directly: const { id } = use(params);

  // State for the fetched voucher, loading status, and errors
  const [voucher, setVoucher] = useState(null); // State to hold the single fetched voucher object
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for UI elements
  const [selectedImage, setSelectedImage] = useState(null); // Initialize selected image to null
  const [activeTab, setActiveTab] = useState("description");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [voucherCode, setVoucherCode] = useState("");


  const handleRedeem = () => {
      if (!agreedToTerms) {
        alert("You must agree to the terms and policies before redeeming.");
        return;
      }
  };
    

  // Function to fetch a single voucher by its ID
  const handleGetVoucher = async (voucherId) => {
    setIsLoading(true);
    setError(null);
    setVoucher(null); // Clear previous voucher data
    console.log(`Workspaceing voucher with ID: ${voucherId}`); // Log the ID being fetched

    try {
      // Construct the API endpoint URL correctly using the voucherId
      const response = await fetch(`http://localhost:8080/api/voucher/id/${voucherId}`, {
        method: "GET",
        credentials: "include", // Be mindful of CORS implications
        headers: {
          "Content-Type": "application/json",
          // Add any other necessary headers like Authorization if needed
        },
      });

      if (!response.ok) {
        // Throw an error with status text for better debugging
        throw new Error(`Error fetching voucher: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log("Fetched data:", data); // Log the received data

      // **Important Check**: Ensure the API returned a valid object
      if (typeof data === 'object' && data !== null && !Array.isArray(data) && data.id) {
         setVoucher(data); // Set the fetched voucher object into state
      } else {
         // Handle cases where API returns nothing, an array, or an invalid object
         console.error("API did not return a valid single voucher object:", data);
         setError("Voucher not found or invalid data format received.");
         setVoucher(null);
      }

    } catch (err) {
      console.error("Failed to fetch voucher:", err);
      // Set a user-friendly error message
      setError(err.message || "An error occurred while loading voucher details.");
      setVoucher(null); // Ensure voucher is null on error
    } finally {
      setIsLoading(false); // Set loading to false regardless of success or failure
    }
  };

  // --- useEffect Hooks ---

  // useEffect to fetch voucher data when component mounts or ID changes
  useEffect(() => {
    if (id) { // Only fetch if ID is present
      handleGetVoucher(id);
    } else {
      setError("No voucher ID provided."); // Handle cases where ID might be missing
      setIsLoading(false);
    }
    // Optional: Cleanup function (e.g., for AbortController) if needed
    // return () => { /* cleanup logic */ };
  }, [id]); // Re-run effect if the id changes

  // useEffect to set the initial selected image *after* voucher data is loaded
  useEffect(() => {
    if (voucher && voucher.images && voucher.images.length > 0) {
      // Set the first image as selected if images exist
      setSelectedImage(voucher.images[0]);
    } else if (voucher && voucher.image) {
      // Fallback if 'images' is not an array but a single 'image' string exists
      setSelectedImage(voucher.image);
    }
    //  else {
    //   // Reset or set placeholder if no images are available
    //   setSelectedImage(PLACEHOLDER_IMAGE);
    // }
  }, [voucher]); // Re-run effect if the voucher data changes

  // --- Event Handlers ---

  const handleAddToCart = () => {
    if (!voucher) {
      console.error("Cannot add to cart: voucher data is not loaded.");
      alert("Could not add item to cart. Please try again later.");
      return;
    }
    // Add the fetched voucher data to the cart
    // Ensure your CartContext expects an object with id, name, price, image, etc.
    addToCart({
        ...voucher,
        // Ensure necessary properties for the cart exist
        id: voucher.id,
        name: voucher.name || "Unnamed Voucher",
        price: voucher.price || 0,
        image: selectedImage || PLACEHOLDER_IMAGE, // Use selected or placeholder
        quantity: 1
    });
    alert(`${voucher.name || 'Voucher'} has been added to your cart!`);
  };

  // --- Render Logic ---

  // 1. Handle Loading State
  if (isLoading) {
    return <div className="loading-message">Loading voucher details...</div>;
  }

  // 2. Handle Error State
  if (error) {
    return <div className="error-message">Error: {error}</div>;
  }

  // 3. Handle Voucher Not Found State
  if (!voucher) {
    return <div className="not-found-message">Voucher not found or is unavailable.</div>;
  }

  // 4. Render Voucher Details (if loading is false, no error, and voucher exists)
  // Assume 'voucher' object has properties like: id, name, price, rating, reviews, images (array), description, additionalInfo
  const displayImages = Array.isArray(voucher.images) && voucher.images.length > 0
                        ? voucher.images
                        : (voucher.image ? [voucher.image] : [PLACEHOLDER_IMAGE]); // Use voucher.image as fallback, then placeholder

  const displaySelectedImage = selectedImage; // Ensure selectedImage has a value

  return (
    <div className="product-container">
      {/* Breadcrumb uses fetched voucher name */}
      <nav className="breadcrumb">
        <Link href="/home">Home</Link> &gt; <Link href="/shop">Shop</Link> &gt;{" "}
        <span>{voucher.title || "Voucher Detail"}</span>
      </nav>

      <div className="product-detail">
        <div className="product-images">
           {/* Thumbnail gallery */}
          <div className="thumbnail-gallery">
            {displayImages.map((image, index) => (
              <img
                key={index}
                src={"http://localhost:8080"+voucher.image}// Use placeholder if image URL is empty/null
                alt={`${voucher.title || 'Voucher'} thumbnail ${index + 1}`}
                className={selectedImage === image ? "thumbnail active" : "thumbnail"}
                onClick={() => setSelectedImage(image || PLACEHOLDER_IMAGE)}
                onError={(e) => e.currentTarget.src = PLACEHOLDER_IMAGE} // Handle broken image links
              />
            ))}
          </div>
          {/* Main image display */}
          <div className="main-image">
             <img
                 src={"http://localhost:8080"+voucher.image}
                alt={voucher.title || 'Voucher'}
                onError={(e) => e.currentTarget.src = PLACEHOLDER_IMAGE} // Handle broken image links
             />
          </div>
        </div>
        <div className="product-info">
          {/* Display fetched voucher data */}
          <h1 className="product-title">{voucher.title || "Unnamed Voucher"}</h1>
          <p className="product-price">
             {typeof voucher.points === 'number' ? `${voucher.points.toLocaleString()}.00 Points` : 'Price not available'}
          </p>
          {/* Rating - Optional: Render only if rating exists */}
          {typeof voucher.rating === 'number' && voucher.rating > 0 && (
             <div className="product-rating">
                {[...Array(5)].map((_, i) => (
                <span key={i} className={i < voucher.rating ? "star filled" : "star"}>
                    ★
                </span>
                ))}
                {/* Reviews Count - Optional */}
                {typeof voucher.reviews === 'number' && (
                   <span className="review-count">({voucher.reviews} reviews)</span>
                )}
            </div>
          )}

          {/* Short Description (use voucher.description or a snippet) */}
          <p className="product-description">
             {/* Provide a fallback if description is missing */}
            {voucher.shortDescription || voucher.description?.substring(0, 150) || "No description available."}
            {voucher.description?.length > 150 ? "..." : ""}
          </p>
          <div className="product-actions">
            <button className="add-to-cart" onClick={handleAddToCart}>
              Add to Cart
            </button>
            <div className="redeem-actions">
              <button
                className="redeem"
                onClick={handleRedeem}
                disabled={!agreedToTerms}
              >
                Redeem
              </button>
            </div>
          </div>

          {/* Redemption Terms and Policies Section */}
          <div className="redemption-terms">
            <h3>Redemption Terms and Policies</h3>
            <ul>
              <li>
                <strong>Points Deduction:</strong> Upon applying the voucher in the cart, the required points ({voucher.points}) will be deducted from your balance.
              </li>
              <li>
                <strong>Non-Refundable:</strong> Redeemed products are non-refundable. Points will not be returned once the redemption is completed.
              </li>
              <li>
                <strong>Product Availability:</strong> Redemption is subject to product availability. If the product is out of stock, you will be notified, and your points will not be deducted.
              </li>
              <li>
                <strong>Expiration:</strong> Points used for redemption must be valid and not expired. Check your points expiration date in your account settings.
              </li>
              <li>
                <strong>One-Time Use:</strong> Each product can only be redeemed once per user unless otherwise stated.
              </li>
            </ul>
            <div className="terms-agreement">
              <label>
                <input
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                />
                I agree to the redemption terms and policies.
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs for Description, Additional Info, Reviews */}
      <div className="tabs">
        <div className="tab-buttons">
           {/* Show Description tab if description exists */}
          {voucher.description && (
             <button
                className={activeTab === "description" ? "tab active" : "tab"}
                onClick={() => setActiveTab("description")}
            >
                Description
            </button>
          )}
           {/* Show Additional Info tab if it exists */}
           {voucher.additionalInfo && (
             <button
                className={activeTab === "additional" ? "tab active" : "tab"}
                onClick={() => setActiveTab("additional")}
             >
                Additional Information
            </button>
           )}
          {/* Show Reviews tab - Placeholder content */}
          <button
            className={activeTab === "reviews" ? "tab active" : "tab"}
            onClick={() => setActiveTab("reviews")}
          >
            {/* Dynamically show review count if available */}
            Reviews [{voucher.reviews || 0}]
          </button>
        </div>
        <div className="tab-content">
          {/* Display content based on active tab and available data */}
          {activeTab === "description" && voucher.description && <p>{voucher.description}</p>}
          {activeTab === "additional" && voucher.additionalInfo && (
            <p style={{ whiteSpace: "pre-line" }}>{voucher.additionalInfo}</p>
          )}
          {activeTab === "reviews" && (
            <p>No reviews yet. Be the first to review this voucher!</p> // Placeholder
          )}
        </div>
      </div>

      {/* Additional Images Section (Optional - could use voucher.images again or specific fields) */}
      {displayImages.length > 1 && ( // Only show if more than one image exists
         <div className="additional-images">
           {displayImages.slice(0, 2).map((img, idx) => ( // Show first 2 images again, for example
             <img key={idx} src={img || PLACEHOLDER_IMAGE} alt={`Voucher image ${idx + 1}`} onError={(e) => e.currentTarget.src = PLACEHOLDER_IMAGE}/>
           ))}
         </div>
      )}



      {/* Related Products Section (Keep static or fetch dynamically based on voucher category/tags) */}
      {/* <div className="related-products">
        <h2 className="section-title">Related Products</h2>
        <div className="product-grid">
          {/* Placeholder: Still using static related products. Fetch dynamically if needed. 
          {[
             { id: 2, name: "Lenovo Headset", price: 1500, image: "/image/headphone.jpg" },
             { id: 3, name: "Asus RTX4070 Ti", price: 8799, image: "/image/Card.jpeg" },
             // Add more static or dynamically fetched related items
           ].map((relatedProduct) => (
            <div key={relatedProduct.id} className="product-card">
              <img  src={"http://localhost:8080"+voucher.image} alt={relatedProduct.title} onError={(e) => e.currentTarget.src = PLACEHOLDER_IMAGE} />
              <h4>{relatedProduct.title}</h4>
              <p>{relatedProduct.points}.00 Points</p>
              <Link href={`/product/${relatedProduct.id}`} className="view-details">
                View Details
              </Link>
            </div>
          ))}
        </div>
      </div> */}
    </div>
  );
}