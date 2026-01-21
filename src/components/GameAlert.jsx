import React, { useEffect } from "react";

const GameAlert = ({ message, onClose }) => {
  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [onClose]);

  return (
    <div
      id="alert-overlay"
      onClick={onClose} // Close when clicking anywhere
      style={{ cursor: "pointer" }}
    >
      <p id="alert-message">{message}</p>
    </div>
  );
};

export default GameAlert;
