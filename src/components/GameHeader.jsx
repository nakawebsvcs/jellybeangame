import React from "react";

const GameHeader = ({
  jellybeans,
  currentRound,
  gameStarted,
  onStartGame,
  tempStatusMessage,
}) => {
  console.log("GameHeader render - tempStatusMessage:", tempStatusMessage);
  return (
    <header className="bg-white">
      <img
        src="/assets/jellybean-game.png"
        width="100%"
        alt="Jelly Bean Game"
      />
      <div className="instructions">
        <p className="info">How will you spend your jellybeans?</p>
        <p className="info">Follow the game prompts for each round.</p>
        <p className="info">Click on a square to place a jellybean.</p>
        <p className="info">Make sure you pay in full for each item!</p>
        <p className="info">
          Click again to remove a jellybean and spend it somewhere else.
        </p>
        <p className="info">
          You must choose at least one item in each{" "}
          <span style={{ color: "red" }}>
            <strong>required </strong>
          </span>
          category (
          <span style={{ color: "red" }}>
            <strong>red</strong>
          </span>{" "}
          categories marked with a star <span style={{ color: "red" }}>★</span>
          ).
        </p>
        <p className="info">
          Good luck! Click "Start Game" or click on a square to begin.
        </p>

        <button
          id="start-game"
          className="btn btn-success"
          onClick={onStartGame}
        >
          Start Game
        </button>
      </div>

      {/* Only show counter when game has started */}
      {gameStarted && (
        <div className="sticky-counter-wrapper">
          <div className="counter-container">
            <div id="jellybean">
              <img src="/assets/red-bean.png" width="40px" alt="Jellybean" />
            </div>
            <div
              id="jellybean-counter"
              className={jellybeans <= 5 ? "jellybean-counter-low" : ""}
            >
              {currentRound === 2 || currentRound === 3
                ? `Jellybeans on board: ${jellybeans}`
                : `Jellybeans left: ${jellybeans}`}
            </div>
          </div>

          {/* Temporary status message */}
          {tempStatusMessage && gameStarted && (
            <div className="temp-status-message">{tempStatusMessage}</div>
          )}
        </div>
      )}
    </header>
  );
};

export default GameHeader;
