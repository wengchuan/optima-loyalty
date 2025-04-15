import { useState } from "react";
import "./ResetPassword.css";

export default function ResetPassword({ onClose }) {
  // Step 1.1: Add state to manage new password fields
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  // Step 1.2: Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
    } else {
      console.log("Password reset successfully.");
      onClose(); // Close the popup after success
    }
  };

  return (
    <div className="reset-password-modal">
      <div className="reset-password-content">
        <h2>Reset Password</h2>
        <form onSubmit={handleSubmit}>
          <label>Enter New Password</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Enter your new password"
            required
          />

          <label>Re-enter New Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Re-enter your new password"
            required
          />

          {/* Display error if passwords don't match */}
          {error && <p className="error-message">{error}</p>}

          <div className="reset-password-actions">
            <button type="submit">Reset Password</button>
            <button type="button" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
