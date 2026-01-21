import React from "react";

const GameControls = ({ onFinishRound, currentRound, gameStarted }) => {
  const getButtonText = () => {
    if (currentRound === 4) return "Finish Game";
    return "Finish Round";
  };

  return (
    <>
      <button
        id="finish-round"
        className="btn"
        onClick={onFinishRound}
        disabled={!gameStarted}
      >
        {getButtonText()}
      </button>
    </>
  );
};

export default GameControls;
