import React from "react";
import Item from "./Item";

const Category = ({ category, boardState, onBeanClick, currentRound }) => {
  // Add validation at the start
  if (!category) {
    console.error("Category component received null/undefined category");
    return <div className="category error">Error: No category data</div>;
  }

  const getHeaderColor = () => {
    return { color: category.color || (category.required ? "red" : "blue") };
  };

  // Validate items array
  const validItems =
    category.items && Array.isArray(category.items) ? category.items : [];

  return (
    <div className={`category ${category.required ? "required" : ""}`}>
      <h2 style={getHeaderColor()}>
        {category.name || "Unnamed Category"}
        {category.required && " ★"}
      </h2>

      {validItems.length > 0 ? (
        validItems.map((item) => (
          <Item
            key={item.id}
            item={item}
            itemState={boardState[item.id]}
            onBeanClick={onBeanClick}
            currentRound={currentRound}
          />
        ))
      ) : (
        <div className="error">No items in this category</div>
      )}
    </div>
  );
};

export default Category;
