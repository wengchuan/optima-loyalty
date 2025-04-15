import * as React from 'react';
import { useState } from 'react';
import Link from 'next/link';
import { Dialog } from '@base-ui-components/react/dialog';
import './searchBox.css';
import { FaSearch } from "react-icons/fa";

export default function SearchBox() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      alert("Please enter a search query.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("http://localhost:8080/api/voucher/search", {
        credentials: "include", // Ensures httpOnly cookies are included
        headers: {
          "Content-Type": "application/json",
        }, // Ensures httpOnly cookies are included
        method: "POST",
        body: JSON.stringify({ title: searchQuery }),
      });

      if (!response.ok) {
        throw new Error(`Search failed: ${response.status}`);
      }

      const data = await response.json();
      setSearchResults(data); // Assuming the API returns an array of results
    } catch (error) {
      console.error("Error during search:", error);
      alert("Failed to fetch search results. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="theme">
      <Dialog.Root>
        <Dialog.Trigger className="Button">
          <FaSearch />
        </Dialog.Trigger>
        <Dialog.Portal keepMounted>
          <div className="theme">
            <Dialog.Backdrop className="Backdrop" />
            <Dialog.Popup className="Popup">
              <Dialog.Title className="Title">Search</Dialog.Title>
              <input
                type="text"
                className="Input"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="Actions">
                <button className="Button" onClick={handleSearch} disabled={loading}>
                  {loading ? "Searching..." : "Search"}
                </button>
                <Dialog.Close className="Button">Close</Dialog.Close>
              </div>
              <div className="SearchResults">
                {searchResults.length > 0 ? (
                  <ul className="SearchResultsList">
                    {searchResults.map((result) => (
                      <Link
                        key={result.id}
                        className="SearchResultItem"
                        href={`/product/${result.id}`} // Assuming you have a dynamic route for item details
                      
                      >
                        {/* Icon */}
                        <img
                          src={"http://localhost:8080" + result.image}
                          alt={result.title}
                          className="SearchResultIcon"
                        />
                        {/* Name */}
                        <span className="SearchResultName">{result.title}</span>
                        {/* Points */}
                        <span className="SearchResultPoints">{result.points} Points</span>
                      </Link>
                    ))}
                  </ul>
                ) : (
                  !loading && <p>No results found.</p>
                )}
              </div>
            </Dialog.Popup>
          </div>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
