"use client";

import { createContext, useContext, useState, useEffect } from "react";

const UserContext = createContext();

export function UserProvider({ children }) {
  const [pointsBalance, setPointsBalance] = useState(0); // Initialize with 0 points
  const [loadingPoints, setLoadingPoints] = useState(true); // Loading state for points

  // Fetch points from API
  const fetchPoints = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/users/points", {
        method: "GET",
        credentials: "include", // Include cookies for authentication
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch points: ${response.status}`);
      }

      const points = await response.json();
      setPointsBalance(points); // Update points balance
    } catch (error) {
      console.error("Error fetching points:", error);
    } finally {
      setLoadingPoints(false); // Stop loading
    }
  };

  // Fetch points on component mount
  useEffect(() => {
    fetchPoints();
  }, []);

  return (
    <UserContext.Provider value={{ pointsBalance, loadingPoints, fetchPoints }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}