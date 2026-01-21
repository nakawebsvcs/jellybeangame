import { useState, useEffect } from "react";
import "./App.css";
import GameHeader from "./components/GameHeader";
import GameBoard from "./components/GameBoard";
import GameControls from "./components/GameControls";
import GameAlert from "./components/GameAlert";
import {
  CATEGORIES,
  ROUNDS,
  REQUIRED_CATEGORIES,
  getCategoryByItemId,
} from "./data/gameData.js";

console.log("CATEGORIES:", CATEGORIES);
console.log("CATEGORIES length:", CATEGORIES.length);

function App() {
  // Game state
  const [currentRound, setCurrentRound] = useState(1);
  const [jellybeans, setJellybeans] = useState(ROUNDS[1].beans);
  const [gameStarted, setGameStarted] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);

  // Initialize board state
  const [boardState, setBoardState] = useState(() => {
    const initialState = {};
    CATEGORIES.forEach((category) => {
      category.items.forEach((item) => {
        initialState[item.id] = {
          max: item.cost,
          isCheckbox: item.isCheckbox || false,
          checked: item.cost === 0 ? false : null,
          filledSquares: Array(item.cost).fill(false),
        };
      });
    });
    return initialState;
  });

  // Show alert message
  const showGameAlert = (message) => {
    setAlertMessage(message);
    setShowAlert(true);
  };

  // Reset game to initial state
  const resetGame = () => {
    console.log("Resetting game to initial state...");

    // Scroll to top of page
    window.scrollTo({
      top: 0,
      behavior: "smooth", // You can remove 'behavior: 'smooth'' for instant scroll
    });

    // Reset all state to initial values
    setCurrentRound(1);
    setJellybeans(ROUNDS[1].beans);
    setGameStarted(false);
    setShowAlert(false);
    setAlertMessage("");

    // Re-initialize board state exactly like the initial state
    const initialState = {};
    CATEGORIES.forEach((category) => {
      category.items.forEach((item) => {
        initialState[item.id] = {
          max: item.cost,
          isCheckbox: item.isCheckbox || false,
          checked: item.cost === 0 ? false : null,
          filledSquares: Array(item.cost).fill(false),
        };
      });
    });
    setBoardState(initialState);
  };

  // Calculate total beans placed
  const calculateTotalPlaced = () => {
    const total = Object.entries(boardState).reduce((total, [itemId, item]) => {
      if (item.isCheckbox && item.checked) {
        return total + item.max;
      }
      return total + item.filledSquares.filter(Boolean).length;
    }, 0);

    console.log(`calculateTotalPlaced: ${total} beans`);
    return total;
  };

  // Jellybeans display
  useEffect(() => {
    const placed = calculateTotalPlaced();

    console.log(`Round ${currentRound}: placed=${placed}`);

    if (currentRound === 2 || currentRound === 3) {
      setJellybeans(placed);
    } else if (currentRound === 4) {
      // For Round 4, calculate based on insurance
      const hasInsurance = hasHealthInsurance();
      const roundMax = hasInsurance ? 15 : 12;
      setJellybeans(roundMax - placed);
    } else {
      // Round 1
      const roundMax = ROUNDS[currentRound].beans;
      setJellybeans(roundMax - placed);
    }
  }, [boardState, currentRound]);

  // Alert when Round 2 reaches exactly 13 beans
  useEffect(() => {
    if (currentRound === 2 && gameStarted) {
      const placed = calculateTotalPlaced();
      if (placed === 13) {
        const timer = setTimeout(() => {
          showGameAlert(
            'You have 13 jellybeans. Click "Finish Round" to move on.'
          );
        }, 100);
        return () => clearTimeout(timer);
      }
    }
  }, [boardState, currentRound, gameStarted]);

  // Alert when Round 3 reaches exactly 10 beans (no insurance scenario)
  useEffect(() => {
    if (currentRound === 3 && gameStarted && !hasHealthInsurance()) {
      const placed = calculateTotalPlaced();
      if (placed === 10) {
        const timer = setTimeout(() => {
          showGameAlert(
            'You have 10 jellybeans. Click "Finish Round" to move on.'
          );
        }, 100);
        return () => clearTimeout(timer);
      }
    }
  }, [boardState, currentRound, gameStarted]);

  // Alert when Round 3 starts - CONDITIONAL BASED ON INSURANCE
  useEffect(() => {
    if (currentRound === 3 && gameStarted) {
      const timer = setTimeout(() => {
        if (hasHealthInsurance()) {
          showGameAlert(
            "Round 3: Someone in your family broke their leg. ☹️ Luckily, you have health insurance! Click 'OK' to continue to Round 4."
          );
        } else {
          showGameAlert(
            "Round 3: Someone in your family broke their leg. ☹️ You do not have insurance; remove 3 jellybeans."
          );
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [currentRound, gameStarted]);

  // Check required categories
  const checkRequiredCategories = () => {
    const uncoveredCategories = [];

    CATEGORIES.forEach((category) => {
      if (category.required) {
        let isCovered = false;

        for (const item of category.items) {
          const itemState = boardState[item.id];
          if (item.isCheckbox) {
            if (itemState.checked) {
              isCovered = true;
              break;
            }
          } else {
            const allFilled = itemState.filledSquares.every((sq) => sq);
            if (allFilled) {
              isCovered = true;
              break;
            }
          }
        }

        if (!isCovered) {
          uncoveredCategories.push(category.name);
        }
      }
    });

    if (uncoveredCategories.length > 0) {
      let alertMessage;

      if (uncoveredCategories.length === 1) {
        alertMessage = `"${uncoveredCategories[0]}" is required. Please pay for at least one item in this category.`;
      } else {
        const lastCategory = uncoveredCategories.pop();
        const categoryList = uncoveredCategories.join(", ");
        alertMessage = `${categoryList} and ${lastCategory} are required. Please pay for at least one item in each of these categories.`;
      }

      showGameAlert(alertMessage);
      return false;
    }

    return true;
  };

  // Check if user has any Health Insurance
  const hasHealthInsurance = () => {
    const jobAccidentCoverage = boardState[7];
    const hasJobAccident =
      jobAccidentCoverage &&
      jobAccidentCoverage.filledSquares.every((sq) => sq);

    const fullHealthCoverage = boardState[8];
    const hasFullCoverage =
      fullHealthCoverage && fullHealthCoverage.filledSquares.every((sq) => sq);

    const healthNone = boardState[6];
    const hasHealthNone = healthNone && healthNone.checked;

    console.log("Insurance check:", {
      hasJobAccident,
      hasFullCoverage,
      hasHealthNoinsurance:
        (hasJobAccident || hasFullCoverage) && !hasHealthNone,
    });

    return (hasJobAccident || hasFullCoverage) && !hasHealthNone;
  };

  // Check for partial payments
  const hasPartialPayments = () => {
    console.log("Checking for partial payments...");

    for (const [itemId, itemState] of Object.entries(boardState)) {
      const itemIdNum = parseInt(itemId);
      let itemDef = null;
      for (const category of CATEGORIES) {
        const foundItem = category.items.find((item) => item.id === itemIdNum);
        if (foundItem) {
          itemDef = foundItem;
          break;
        }
      }

      if (itemDef && itemDef.cost > 0 && !itemDef.isCheckbox) {
        const filledCount = itemState.filledSquares.filter(Boolean).length;
        console.log(
          `Item ${itemId}: ${itemDef.name}, cost: ${itemDef.cost}, filled: ${filledCount}`
        );

        if (filledCount > 0 && filledCount < itemDef.cost) {
          console.log(`FOUND PARTIAL PAYMENT: ${itemDef.name}`);
          return true;
        }

        const firstEmptyIndex = itemState.filledSquares.findIndex((sq) => !sq);
        if (firstEmptyIndex !== -1) {
          const hasFilledAfterGap = itemState.filledSquares
            .slice(firstEmptyIndex)
            .some((sq) => sq);

          if (hasFilledAfterGap) {
            console.log(`FOUND GAP IN PAYMENT: ${itemDef.name}`);
            return true;
          }
        }
      }
    }

    console.log("No partial payments found.");
    return false;
  };

  // Check if round can be finished
  const canFinishRound = () => {
    const placed = calculateTotalPlaced();

    console.log(`=== DEBUG canFinishRound ===`);
    console.log(`Current Round: ${currentRound}`);
    console.log(`Beans placed on board: ${placed}`);
    console.log(`Jellybeans counter value: ${jellybeans}`);

    // Round-specific validation
    if (currentRound === 1) {
      if (placed !== 20) {
        showGameAlert(
          `You still have ${20 - placed} jellybeans left to spend.`
        );
        return false;
      }
    } else if (currentRound === 2) {
      if (placed !== 13) {
        if (placed > 13) {
          showGameAlert(
            `You have ${placed} beans on the board. Remove ${
              placed - 13
            } more to continue.`
          );
        } else {
          showGameAlert(
            `You have ${placed} beans on the board. You need ${
              13 - placed
            } more to continue.`
          );
        }
        return false;
      }
    } else if (currentRound === 3) {
      if (hasHealthInsurance()) {
        if (placed !== 13) {
          showGameAlert(
            `You have ${placed} beans on the board. You need ${
              13 - placed
            } more to continue.`
          );
          return false;
        }
      } else {
        if (placed !== 10) {
          if (placed > 10) {
            showGameAlert(`You need to remove ${placed - 10} more jellybeans.`);
          } else {
            showGameAlert(
              `You removed too many! You need ${10 - placed} more beans.`
            );
          }
          return false;
        }
      }
    } else if (currentRound === 4) {
      const hasInsurance = hasHealthInsurance();
      const targetBeans = hasInsurance ? 15 : 12;

      if (placed !== targetBeans) {
        showGameAlert(
          `You have ${placed} beans on the board. You need ${
            targetBeans - placed
          } more to finish the game.`
        );
        return false;
      }
    }

    if (hasPartialPayments()) {
      showGameAlert(
        "You have partial payments! Please pay in full for all items before finishing the round."
      );
      return false;
    }

    if (!checkRequiredCategories()) {
      return false;
    }

    return true;
  };

  // Handle finishing a round
  const handleFinishRound = () => {
    console.log(`=== handleFinishRound called for Round ${currentRound} ===`);

    if (!canFinishRound()) {
      console.log(`canFinishRound returned false - round cannot be finished`);
      return;
    }

    console.log(`Proceeding to next round...`);

    if (currentRound === 1) {
      setCurrentRound(2);
      showGameAlert(ROUNDS[2].message);
    } else if (currentRound === 2) {
      setCurrentRound(3);
    } else if (currentRound === 3) {
      // Only gets here if user doesn't have insurance
      // (With insurance, specialAction handles advancement)
      setCurrentRound(4);
      showGameAlert(
        "Final Round: You've received a raise of 2 jellybeans! Spend your beans wisely!"
      );
    } else if (currentRound === 4) {
      showGameAlert(
        "Congratulations! You have completed the game by successfully budgeting through life's ups and downs!"
      );
    }
  };

  // Handle placing/removing a jellybean
  const handleBeanClick = (itemId, squareIndex) => {
    if (!gameStarted) {
      setGameStarted(true);
      showGameAlert(ROUNDS[1].message);
    }

    const item = boardState[itemId];
    const totalPlaced = calculateTotalPlaced();

    console.log(
      "Bean clicked:",
      itemId,
      "Square:",
      squareIndex,
      "Round:",
      currentRound,
      "Beans on board:",
      totalPlaced
    );

    if (item.isCheckbox) {
      setBoardState((prev) => ({
        ...prev,
        [itemId]: { ...prev[itemId], checked: !prev[itemId].checked },
      }));
      return;
    }

    const isSquareFilled = item.filledSquares[squareIndex];

    if (currentRound === 2) {
      if (isSquareFilled) {
        setBoardState((prev) => {
          const newFilledSquares = [...prev[itemId].filledSquares];
          newFilledSquares[squareIndex] = false;
          return {
            ...prev,
            [itemId]: { ...prev[itemId], filledSquares: newFilledSquares },
          };
        });
      } else {
        if (totalPlaced < 13) {
          setBoardState((prev) => {
            const newFilledSquares = [...prev[itemId].filledSquares];
            newFilledSquares[squareIndex] = true;
            return {
              ...prev,
              [itemId]: { ...prev[itemId], filledSquares: newFilledSquares },
            };
          });
        } else {
          showGameAlert(`You can only have 13 beans on the board.`);
        }
      }
      return;
    }

    if (currentRound === 3) {
      const hasInsurance = hasHealthInsurance();
      const targetBeans = hasInsurance ? 13 : 10;

      if (isSquareFilled) {
        setBoardState((prev) => {
          const newFilledSquares = [...prev[itemId].filledSquares];
          newFilledSquares[squareIndex] = false;
          return {
            ...prev,
            [itemId]: { ...prev[itemId], filledSquares: newFilledSquares },
          };
        });
      } else {
        if (totalPlaced < targetBeans) {
          setBoardState((prev) => {
            const newFilledSquares = [...prev[itemId].filledSquares];
            newFilledSquares[squareIndex] = true;
            return {
              ...prev,
              [itemId]: { ...prev[itemId], filledSquares: newFilledSquares },
            };
          });
        } else {
          const message = hasInsurance
            ? `You can only have 13 beans on the board.`
            : `You can only have 10 beans on the board.`;
          showGameAlert(message);
        }
      }
      return;
    }

    const roundMax =
      currentRound === 1
        ? 20
        : currentRound === 4
        ? hasHealthInsurance()
          ? 15
          : 12
        : 0;
    const beansLeftToSpend = roundMax - totalPlaced;

    if (isSquareFilled) {
      setBoardState((prev) => {
        const newFilledSquares = [...prev[itemId].filledSquares];
        newFilledSquares[squareIndex] = false;
        return {
          ...prev,
          [itemId]: { ...prev[itemId], filledSquares: newFilledSquares },
        };
      });
    } else {
      if (beansLeftToSpend > 0) {
        setBoardState((prev) => {
          const newFilledSquares = [...prev[itemId].filledSquares];
          newFilledSquares[squareIndex] = true;
          return {
            ...prev,
            [itemId]: { ...prev[itemId], filledSquares: newFilledSquares },
          };
        });
      } else {
        showGameAlert("You have no more jellybeans to spend!");
      }
    }
  };

  // Start the game
  const handleStartGame = () => {
    console.log("Game started via button");
    if (!gameStarted) {
      setGameStarted(true);
      showGameAlert(ROUNDS[1].message);
    }
  };

  return (
    <div className="container">
      <GameHeader
        jellybeans={jellybeans}
        currentRound={currentRound}
        gameStarted={gameStarted}
        onStartGame={handleStartGame}
      />

      <main>
        <GameBoard
          categories={CATEGORIES}
          boardState={boardState}
          onBeanClick={handleBeanClick}
          currentRound={currentRound}
        />

        <GameControls
          onFinishRound={handleFinishRound}
          currentRound={currentRound}
          gameStarted={gameStarted}
        />
      </main>

      <footer>
        Developed for the web by{" "}
        <a
          href="https://nakamurawebservices.com"
          target="_blank"
          rel="noopener noreferrer"
          className="footer-link"
        >
          Nakamura Web Services
        </a>
        <br />
        REFERENCES: Parker, L. (n.d.) The Bean Game. Washington State University
        Extension, Family Resource Management Specialist.
        <br /> Office of State Treasurer John Perdue. (n.d.). The Budget Game:
        Living on a 20 Square Salary. Financial Education Programs, Charleston,
        WV. <br />
        Jana Darrington, M.S. (n.d.) Utah State University Extension
      </footer>

      {showAlert && (
        <GameAlert
          message={alertMessage}
          onClose={() => setShowAlert(false)}
          specialAction={
            currentRound === 3 &&
            hasHealthInsurance() &&
            alertMessage.includes("Luckily, you have health insurance")
              ? () => {
                  console.log(
                    "Advancing from Round 3 to Round 4 via special action"
                  );
                  setCurrentRound(4);
                  setTimeout(() => {
                    showGameAlert(
                      "Final Round: You've received a raise of 2 jellybeans! Spend your beans wisely!"
                    );
                  }, 300);
                }
              : currentRound === 4 && alertMessage.includes("Congratulations")
              ? resetGame // This will reset the game when OK is clicked
              : undefined
          }
        />
      )}
    </div>
  );
}

export default App;
