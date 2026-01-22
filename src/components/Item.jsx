import React from "react";

const Item = ({ item, itemState, onBeanClick, currentRound }) => {
  const handleCheckboxChange = () => {
    onBeanClick(item.id, 0); // For checkboxes, we pass 0 as squareIndex
  };

  // Determine if this item is partially paid
  const isPartiallyPaid = () => {
    if (item.cost === 0 || item.isCheckbox) return false;

    const filledCount = itemState.filledSquares.filter(Boolean).length;
    return filledCount > 0 && filledCount < item.cost;
  };

  const partiallyPaid = isPartiallyPaid();

  // Render checkbox for 0-cost items
  if (item.cost === 0 || item.isCheckbox) {
    return (
      <div className="item">
        <div className="item-name">{item.name}</div>
        <div className="checkbox-container">
          <div className="no-cost-text">NO COST</div>
          <label className="checkbox-label">
            <input
              type="checkbox"
              id={`checkbox-${item.id}`}
              checked={itemState.checked || false}
              onChange={handleCheckboxChange}
              className="no-cost-checkbox"
            />
            <span className="checkbox-custom"></span>
          </label>
        </div>
      </div>
    );
  }

  // Render squares for items with cost
  return (
    <div className={`item ${partiallyPaid ? "partial-payment" : ""}`}>
      <div className="item-name">
        {item.name}
        {partiallyPaid && (
          <span className="partial-warning"> ⚠ Partial payment</span>
        )}
      </div>
      <div className="squares-container">
        {itemState.filledSquares.map((isFilled, index) => {
          return (
            <div
              key={index}
              className={`square ${isFilled ? "selected" : ""} ${
                partiallyPaid && isFilled ? "partial" : ""
              }`}
              onClick={() => onBeanClick(item.id, index)}
              title={`${item.name} - ${index + 1}/${item.cost}`}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Item;
