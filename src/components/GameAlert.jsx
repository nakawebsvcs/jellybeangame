import React, { useEffect } from "react";

const GameAlert = ({ message, onClose, specialAction }) => {
  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        console.log("Escape pressed, closing alert");
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [onClose]);

  const handleClose = () => {
    console.log("Alert close button clicked");
    console.log("specialAction exists?", !!specialAction);
    onClose();
    // If there's a special action (like advancing to next round), execute it
    if (specialAction) {
      console.log("Executing special action");
      specialAction();
    }
  };

  return (
    <div id="alert-overlay" onClick={handleClose}>
      <div className="alert-content" onClick={(e) => e.stopPropagation()}>
        <p id="alert-message">{message}</p>
        <button
          className="alert-close-btn"
          onClick={handleClose}
          aria-label="Close alert"
        >
          OK
        </button>
      </div>
    </div>
  );
};

export default GameAlert;
