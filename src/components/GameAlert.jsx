import React, { useEffect } from "react";

const GameAlert = ({
  message,
  onClose,
  specialAction,
  sectionTitle,
  sectionContent,
  type = "warning"
}) => {
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

  const handleClose = () => {
    onClose();
    if (specialAction) {
      specialAction();
    }
  };

  return (
    <div id="alert-overlay" onClick={handleClose}>
      <div className="alert-content" onClick={(e) => e.stopPropagation()}>
        {/* Section (discussion questions) - Shows at TOP */}
        {sectionTitle && (
          <div className="alert-section">
            <h3 className="section-title">{sectionTitle}</h3>
            <div className="section-content" style={{ whiteSpace: "pre-line" }}>
              {sectionContent}
            </div>
          </div>
        )}

        {/* Divider if we have both sections and message */}
        {sectionTitle && message && <hr className="section-divider" />}

        {/* Main Message (round instructions) - Shows at BOTTOM */}
        {message && (
          <p
            id="alert-message"
            style={{
              whiteSpace: "pre-line",
              color: type === "instruction" ? "blue" : "red",
            }}
          >
            {message}
          </p>
        )}

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
