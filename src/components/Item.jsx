import React from "react";

const Item = ({ item, itemState, onBeanClick, currentRound }) => {
  const handleCheckboxChange = () => {
    onBeanClick(item.id);
  };

  // Determine if this item is partially paid
  const isPartiallyPaid =
    item.cost > 0 &&
    !item.isCheckbox &&
    itemState.placed > 0 &&
    itemState.placed < item.cost;

  // Render checkbox for 0-cost items
  if (item.cost === 0 || item.isCheckbox) {
    return (
      <div className="item">
        <div className="item-name">{item.name}</div>
        <div className="checkbox-container">
          <div className="no-cost-text">No cost</div>
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
    <div className={`item ${isPartiallyPaid ? "partial-payment" : ""}`}>
      <div className="item-name">
        {item.name}
        {isPartiallyPaid && (
          <span className="partial-warning"> ⚠ Partial payment</span>
        )}
      </div>
      <div className="squares-container">
        {Array.from({ length: item.cost }).map((_, index) => {
          const isFilled = index < itemState.placed;
          const isPartial = isPartiallyPaid && isFilled;
          return (
            <div
              key={index}
              className={`square ${isFilled ? "selected" : ""} ${
                isPartial ? "partial" : ""
              }`}
              onClick={() => onBeanClick(item.id)}
              title={`${item.name} - ${index + 1}/${item.cost}`}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Item;
