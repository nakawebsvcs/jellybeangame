import React from "react";
import Category from "./Category";

const GameBoard = ({ categories, boardState, onBeanClick, currentRound }) => {
  // Add validation
  if (!categories || !Array.isArray(categories) || categories.length === 0) {
    return (
      <div className="gameboard">
        <div className="error">
          No categories loaded. Please check game data.
        </div>
      </div>
    );
  }

  return (
    <div className="gameboard">
      {categories.map((category) => {
        // Validate each category
        if (!category || !category.id) {
          console.error("Invalid category:", category);
          return null;
        }

        return (
          <Category
            key={category.id}
            category={category}
            boardState={boardState}
            onBeanClick={onBeanClick}
            currentRound={currentRound}
          />
        );
      })}
    </div>
  );
};

export default GameBoard;
