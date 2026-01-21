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
          placed: 0,
          max: item.cost,
          isCheckbox: item.isCheckbox || false,
          checked: item.cost === 0 ? false : null, // null means not a checkbox, false/true for checkboxes
        };
      });
    });
    return initialState;
  });

  // Show alert message
  const showGameAlert = (message) => {
    setAlertMessage(message);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 4000);
  };

  // Calculate total beans placed
  const calculateTotalPlaced = () => {
    const total = Object.entries(boardState).reduce((total, [itemId, item]) => {
      if (item.isCheckbox && item.checked) {
        return total + item.max; // Add cost if checkbox is checked
      }
      return total + item.placed;
    }, 0);

    console.log(`calculateTotalPlaced: ${total} beans`);
    return total;
  };

  // Jellybeans display
 useEffect(() => {
   const placed = calculateTotalPlaced();
   const roundMax = ROUNDS[currentRound].beans;

   console.log(`Round ${currentRound}: placed=${placed}, roundMax=${roundMax}`);

   if (currentRound === 2) {
     // Round 2: Show beans currently ON THE BOARD (starting at 20 from Round 1, target is 13)
     setJellybeans(placed); // This will show 20 → 13 as beans are removed
   } else {
     // Rounds 1, 3, 4: Show beans LEFT TO SPEND
     setJellybeans(roundMax - placed); // This will show 20 → 0, 13 → 0, 2 → 0
   }
 }, [boardState, currentRound]);

  // Check if all required categories are covered
  const checkRequiredCategories = () => {
    const categoryCoverage = {};

    CATEGORIES.forEach((category) => {
      if (category.required) {
        let isCovered = false;

        category.items.forEach((item) => {
          const itemState = boardState[item.id];
          if (item.isCheckbox) {
            if (itemState.checked) isCovered = true;
          } else {
            if (itemState.placed === item.cost) isCovered = true;
          }
        });

        categoryCoverage[category.name] = isCovered;

        if (!isCovered) {
          showGameAlert(
            `Please cover the cost of at least one item in the ${category.name} category.`
          );
          return false;
        }
      }
    });

    return true;
  };

  // Check if user has Full Health Coverage insurance
  const hasFullHealthInsurance = () => {
    // Find Full Health Coverage item (item id: 8)
    const healthInsuranceState = boardState[8]; // Full Health Coverage
    return healthInsuranceState && healthInsuranceState.placed === 2;
  };

  // Check for partial payments
  const hasPartialPayments = () => {
    console.log("Checking for partial payments...");

    for (const [itemId, itemState] of Object.entries(boardState)) {
      const itemIdNum = parseInt(itemId);
      // Find the item definition
      let itemDef = null;
      for (const category of CATEGORIES) {
        const foundItem = category.items.find((item) => item.id === itemIdNum);
        if (foundItem) {
          itemDef = foundItem;
          break;
        }
      }

      if (itemDef && itemDef.cost > 0 && !itemDef.isCheckbox) {
        console.log(
          `Item ${itemId}: ${itemDef.name}, cost: ${itemDef.cost}, placed: ${itemState.placed}`
        );
        if (itemState.placed > 0 && itemState.placed < itemDef.cost) {
          console.log(`FOUND PARTIAL PAYMENT: ${itemDef.name}`);
          return true; // Return true immediately when found
        }
      }
    }

    console.log("No partial payments found.");
    return false; // Return false if none found
  };

  // Check if round can be finished
  const canFinishRound = () => {
    const placed = calculateTotalPlaced();
    const roundMax = ROUNDS[currentRound].beans;

    console.log(`=== DEBUG canFinishRound ===`);
    console.log(`Current Round: ${currentRound}`);
    console.log(`Beans placed on board: ${placed}`);
    console.log(`Round max beans: ${roundMax}`);
    console.log(`Jellybeans counter value: ${jellybeans}`);

    // Check if all beans are spent/removed correctly
    if (currentRound === 2) {
      // Round 2: Must have exactly 13 beans on board
      if (placed !== 13) {
        if (placed > 13) {
          showGameAlert(
            `You have ${placed} beans on the board. Remove ${
              placed - 13
            } more to continue.`
          );
        } else if (placed < 13) {
          showGameAlert(
            `You have ${placed} beans on the board. You need ${
              13 - placed
            } more to continue.`
          );
        }
        return false;
      }
    } else {
      // Rounds 1, 3, 4: Must spend all beans (placed should equal roundMax)
      if (placed !== roundMax) {
        showGameAlert(
          `You still have ${roundMax - placed} jellybeans left to spend.`
        );
        return false;
      }
    }

    // Check for partial payments
    if (hasPartialPayments()) {
      showGameAlert(
        "You have partial payments! Please pay in full for all items before finishing the round."
      );
      return false;
    }

    // Check required categories
    if (!checkRequiredCategories()) {
      return false;
    }

    // Round 3: Check insurance
    if (currentRound === 3) {
      if (!hasFullHealthInsurance()) {
        showGameAlert(
          "You don't have Full Health Coverage. Remove 3 jellybeans."
        );
        // We'll handle the removal in the finishRound function
      }
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
      showGameAlert(ROUNDS[3].message);
    } else if (currentRound === 3) {
      // Check if insurance penalty needs to be applied
      if (!hasFullHealthInsurance()) {
        // Remove 3 beans - find items with beans and remove them
        let beansToRemove = 3;
        const newBoardState = { ...boardState };

        // Find items with placed beans and remove them
        for (const [itemId, item] of Object.entries(newBoardState)) {
          if (beansToRemove <= 0) break;

          if (!item.isCheckbox && item.placed > 0) {
            const toRemove = Math.min(item.placed, beansToRemove);
            newBoardState[itemId].placed -= toRemove;
            beansToRemove -= toRemove;
          }
        }

        setBoardState(newBoardState);
        showGameAlert(
          "3 jellybeans removed due to lack of insurance. Now you have received a 2 jellybean raise!"
        );
        setCurrentRound(4);
      } else {
        showGameAlert(
          "Good thing you have insurance! Now you have received a 2 jellybean raise!"
        );
        setCurrentRound(4);
      }
    } else if (currentRound === 4) {
      showGameAlert("Congratulations! You have completed the game.");
    }
  };

  // Handle placing/removing a jellybean
  const handleBeanClick = (itemId) => {
    // Start game if not already started
    if (!gameStarted) {
      setGameStarted(true);
      showGameAlert(ROUNDS[1].message);
    }

    const item = boardState[itemId];
    const roundMax = ROUNDS[currentRound].beans;
    const totalPlaced = calculateTotalPlaced(); // Beans currently on board

    // Calculate beans left to spend (for Rounds 1, 3, 4) or beans on board (for Round 2)
    const beansLeftToSpend = roundMax - totalPlaced;

    console.log(
      "Bean clicked:",
      itemId,
      "Round:",
      currentRound,
      "Beans on board:",
      totalPlaced,
      "Beans left to spend:",
      beansLeftToSpend
    );

    // Handle checkbox items (0-cost items)
    if (item.isCheckbox) {
      setBoardState((prev) => ({
        ...prev,
        [itemId]: { ...prev[itemId], checked: !prev[itemId].checked },
      }));
      return;
    }

    // ROUND 2: Flexible bean management - can remove AND add/move beans
    if (currentRound === 2) {
      console.log(
        `Round 2: totalPlaced=${totalPlaced}, trying to ${
          item.placed === 0 ? "ADD" : "REMOVE"
        } bean`
      );

      // Trying to ADD a bean (clicking empty square)
      if (item.placed === 0) {
        // Check if we're at the limit
        if (totalPlaced >= 13) {
          showGameAlert(
            `You can only have 13 beans on the board. Remove some beans first.`
          );
          return;
        }

        // Check if we can afford this item
        if (totalPlaced + 1 > 13) {
          showGameAlert(
            `Adding this bean would give you ${
              totalPlaced + 1
            } beans. Maximum is 13.`
          );
          return;
        }

        // Add the bean
        setBoardState((prev) => ({
          ...prev,
          [itemId]: { ...prev[itemId], placed: prev[itemId].placed + 1 },
        }));
      }
      // Trying to REMOVE a bean (clicking occupied square)
      else if (item.placed > 0) {
        // Always allow removing beans
        setBoardState((prev) => ({
          ...prev,
          [itemId]: { ...prev[itemId], placed: prev[itemId].placed - 1 },
        }));
      }
      return;
    }

    // Check if user has no jellybeans left (for Rounds 1, 3, 4)
    if (beansLeftToSpend <= 0 && item.placed === 0) {
      showGameAlert("You have no more jellybeans to spend!");
      return;
    }

    // Normal logic for other rounds
    if (item.placed < item.max && totalPlaced < roundMax) {
      // Place bean
      setBoardState((prev) => ({
        ...prev,
        [itemId]: { ...prev[itemId], placed: prev[itemId].placed + 1 },
      }));
    } else if (item.placed > 0) {
      // Remove bean
      setBoardState((prev) => ({
        ...prev,
        [itemId]: { ...prev[itemId], placed: prev[itemId].placed - 1 },
      }));
    } else {
      // Item is full or no beans available
      if (item.placed === item.max) {
        showGameAlert(
          `This item is fully paid (${item.max} jellybeans). Click to remove beans.`
        );
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
      </footer>

      {showAlert && (
        <GameAlert message={alertMessage} onClose={() => setShowAlert(false)} />
      )}
    </div>
  );
}

export default App;
