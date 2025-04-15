"use client";

import Link from "next/link";
import { useState, useEffect } from "react"; // Added useEffect import
import { useSearchParams } from "next/navigation";
import "./Shop.css";

export default function Shop() {
  const [currentPage, setCurrentPage] = useState(1);
  const [vouchers, setVouchers] = useState([]); // State to hold fetched vouchers
  const productsPerPage = 8; // You might want to rename this to vouchersPerPage for clarity
  const searchParams = useSearchParams();
  const category = searchParams.get("category") || "all";

  // Function to fetch vouchers based on category
  const handleGetCategory = async (cat) => {
    // Clear existing vouchers before fetching new ones or if category is not handled
    setVouchers([]);
    setCurrentPage(1); // Reset to first page when category changes

    if (cat === "computer") {
      try {
        console.log("Fetching electronic vouchers..."); // Added log
        const response = await fetch("http://localhost:8080/api/voucher/category", {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            categoryId: "1", // Assuming "1" corresponds to "electronic"
          }),
        });

        if (!response.ok) {
          throw new Error(`Error fetching vouchers: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log("Fetched data:", data); // Added log
        setVouchers(Array.isArray(data) ? data : []); // Ensure data is an array
      } catch (error) {
        console.error("Failed to fetch electronic vouchers:", error);
        setVouchers([]); // Ensure vouchers are empty on error
      }
    } else if (cat === "all") {
      // --- TODO: Implement fetching ALL vouchers ---
      // You'll need an endpoint or logic to fetch all vouchers.
      // Example (replace with your actual API call):
      
      try {
        console.log("Fetching all vouchers...");
        const response = await fetch("http://localhost:8080/api/voucher/", { // Adjust endpoint as needed
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
          }),
        });
        if (!response.ok) throw new Error(`Error: ${response.status}`);
        const data = await response.json();
        setVouchers(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to fetch all vouchers:", error);
        setVouchers([]);
      }
      
      console.log("Fetching 'all' category - Implement specific API call.");
      // Currently leaves vouchers empty for 'all'
      //setVouchers([]);
    } else {
      // Handle other potential categories or default case
      console.log(`Category '${cat}' not implemented for fetching, showing no vouchers.`);
      setVouchers([]);
    }
  };

  // useEffect to fetch data when the component mounts or the category changes
  useEffect(() => {
    handleGetCategory(category);
  }, [category]); // Dependency array includes category

  // Calculate pagination based on the fetched vouchers state
  const totalProducts = vouchers.length; // Use vouchers length
  const startIndex = (currentPage - 1) * productsPerPage;
  // Slice the vouchers array for the current page's display
  const currentProducts = vouchers.slice(startIndex, startIndex + productsPerPage); // Use vouchers
  const totalPages = Math.ceil(totalProducts / productsPerPage);

  // Handle pagination click
  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Capitalize the category for display title
  const displayCategory =
    category === "all"
      ? "All Products"
      : category.charAt(0).toUpperCase() + category.slice(1);

  return (
    <div className="shop-container">
      {/* Category Header */}
      <div className="category-header">
        <nav className="breadcrumb">
          <Link href="/home">Home</Link> &gt; <span>{displayCategory}</span>
        </nav>
        <h1 className="category-title">{displayCategory}</h1>
      </div>

      {/* Filter Bar */}
      <div className="filter-bar">
        <div className="filter-left">
          <button className="filter-btn">Filter</button> {/* Add filter functionality if needed */}
          <span className="result-count">
            {/* Updated count display logic for clarity */}
            Showing {totalProducts > 0 ? startIndex + 1 : 0}-
            {Math.min(startIndex + productsPerPage, totalProducts)} of {totalProducts} results
          </span>
        </div>
        {/* Filter right controls (sorting/show amount) - functionality not implemented here */}
        <div className="filter-right">
            <label htmlFor="show">Show</label>
            <select id="show" className="sort-select">
                <option value="16">16</option>
                <option value="32">32</option>
                <option value="48">48</option>
            </select>
            <label htmlFor="sort-by">Sort by</label>
            <select id="sort-by" className="sort-select">
                <option value="default">Default</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
            </select>
        </div>
      </div>

      {/* Product Grid - Now maps over currentProducts derived from vouchers */}
      <div className="product-grid">
        {currentProducts.length > 0 ? (
          currentProducts.map((voucher) => ( // Renamed variable to 'voucher'
            // Ensure voucher object has id, image, name, price properties matching your API response
            <div key={voucher.id} className={`product-card ${voucher.isNew ? "new" : ""}`}>
              {/* Use a placeholder if image is missing */}
              <img src={"http://localhost:8080"+voucher.image} alt={voucher.name || 'Voucher'} />
              <h4>{voucher.title || 'Unnamed Voucher'}</h4>
              {/* Ensure price exists and is a number, handle potential null/undefined */}
              <p>{typeof voucher.points === 'number' ? `${voucher.points.toLocaleString()}.00 Points` : 'Price not available'}</p>
              {/* Link to a detail page - adjust href as needed */}
              <Link href={`/product/${voucher.id}`} className="view-details">
                View Details
              </Link>
            </div>
          ))
        ) : (
           // Display a message if no vouchers are found for the current category/fetch
           <p className="no-products-message">No vouchers found for '{displayCategory}'.</p>
        )}
      </div>

      {/* Pagination - Logic remains the same, but based on totalPages derived from vouchers */}
      <div className="pagination">
        {/* Only render pagination controls if there are multiple pages */}
        {totalPages > 1 && (
          <>
            {/* Previous Button (Optional) */}
            {currentPage > 1 && (
              <button className="page-btn" onClick={() => handlePageChange(currentPage - 1)}>
                Prev
              </button>
            )}

            {/* Page Number Buttons */}
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index + 1}
                className={`page-btn ${currentPage === index + 1 ? "active" : ""}`}
                onClick={() => handlePageChange(index + 1)}
              >
                {index + 1}
              </button>
            ))}

            {/* Next Button */}
            {currentPage < totalPages && (
              <button className="page-btn" onClick={() => handlePageChange(currentPage + 1)}>
                Next
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}