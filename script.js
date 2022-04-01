const suits = ["Hearts", "Clubs", "Diamonds", "Spades"],
  values = [
    "Ace",
    "King",
    "Queen",
    "Jack",
    "Ten",
    "Nine",
    "Eight",
    "Seven",
    "Six",
    "Five",
    "Four",
    "Three",
    "Two"
  ];

// Game variables
let gameStarted = false,
  gameOver = false,
  playerWon = false,
  isDraw = false,
  isFirstRun = true,
  dealerCards = [],
  playerCards = [],
  dealerScore = 0,
  playerScore = 0,
  deck = [];

// DOM variables (needed for UI control)
let textArea = document.getElementById("text-area");
let newGameButton = document.getElementById("new-game-button");
let hitMeButton = document.getElementById("hit-me-button");
let stayButton = document.getElementById("stay-button");

intialPageSetup();

// All function definitions and event handlers

/**
 * @desc sets up deck of cards
 * @returns array of card(s)
 */
function createDeckOfCards() {
  let deckOfCards = [];
  suits.forEach((cardSuit) => {
    values.forEach((cardValue) => {
      let card = {
        suit: cardSuit,
        value: cardValue
      };
      deckOfCards.push(card);
    });
  });
  return deckOfCards;
}

/**
 * @desc gets the next card in the deck
 * @return card - removes the first element from the array and returns it
 */
function getNextCard() {
  return deck.shift();
}

/**
 * @desc gets card object as a string, this will include "card value of card suit"
 * @param {*} card
 * @return String - "card value of card suit"
 */
function getCardAsString(card) {
  return card.value + " of " + card.suit;
}

/**
 * @desc sets up the initial display on page load
 */
function intialPageSetup() {
  hitMeButton.style.display = "none";
  stayButton.style.display = "none";
}

/**
 * @desc Displays status by calling various functions.
 */
function showStatus() {
  if (!gameStarted) {
    textArea.innerText = "Justin's blackjack table";
    return;
  }

  updateScores();
  printScores();

  if (isFirstRun) {
    doFirstRunChecks();
  }

  if (gameOver) {
    printResults();
    updateButtonsToInitialConfiguration();
  }
}

/**
 * @desc Updates the buttons to initial configuration,
 * i.e. hides the 'Hit' and 'Stay' button and displays
 * the 'New game' button.
 *
 */
function updateButtonsToInitialConfiguration() {
  newGameButton.style.display = "inline";
  hitMeButton.style.display = "none";
  stayButton.style.display = "none";
}

/**
 * @desc Prints out the results, this would ideally be called when the game is over.
 */
function printResults() {
  !isDraw
    ? playerWon
      ? (textArea.innerText += "YOU WIN !!!")
      : (textArea.innerText += "YOU LOST, u really just lost to a website!!!")
    : (textArea.innerText += "DRAW !!!");
}

/**
 * @desc Prints out player's and dealer's scores.
 */
function printScores() {
  let dealerCardAsString = "";
  dealerCards.forEach((dealerCard) => {
    dealerCardAsString += getCardAsString(dealerCard) + "\n";
  });

  let playerCardAsString = "";
  playerCards.forEach((playerCard) => {
    playerCardAsString += getCardAsString(playerCard) + "\n";
  });

  textArea.innerText =
    "Dealer has : \n" +
    dealerCardAsString +
    "(score :" +
    dealerScore +
    ")\n\n" +
    "Player has : \n" +
    playerCardAsString +
    "(score :" +
    playerScore +
    ")\n\n";
}

/**
 * @desc Updates the dealerScore and the playerScore by calling
 * the getScore() function.
 *
 */
function updateScores() {
  [dealerScore, playerScore] = [getScore(dealerCards), getScore(playerCards)];
}

/**
 * @desc Gets the total score based on array of cards passed in.
 *
 * @param {*} cardArray
 */
function getScore(cardArray) {
  let score = 0;
  let hasAce = false;

  cardArray.forEach((card) => {
    score += getCardNumericValue(card);
    if (card.value === "Ace") {
      hasAce = true;
    }
  });

  return hasAce && score + 10 <= 21 ? (score += 10) : score;
}

/**
 * @desc6.
 *
 * @param {*} card
 */
function getCardNumericValue(card) {
  switch (card.value) {
    case "Ace":
      return 1;
    case "Two":
      return 2;
    case "Three":
      return 3;
    case "Four":
      return 4;
    case "Five":
      return 5;
    case "Six":
      return 6;
    case "Seven":
      return 7;
    case "Eight":
      return 8;
    case "Nine":
      return 9;
    default:
      return 10;
  }
}

/**
 * @desc shuffles deck of cards
 * @param {*} deck
 */
function shuffleDeck(deck) {
  deck.forEach((card) => {
    const swapIdx = Math.trunc(Math.random() * deck.length);
    [deck[swapIdx], card] = [card, deck[swapIdx]];
  });
}

function checkIfItIsEndOfGame() {
  updateScores();

  do {
    dealerCards.push(getNextCard());
    updateScores();
  } while (dealerScore < playerScore && playerScore <= 21 && dealerScore <= 21);

  if (playerScore > 21) {
    [playerWon, gameOver] = [false, true];
  } else if (dealerScore > 21) {
    [playerWon, gameOver] = [true, true];
  } else if (gameOver) {
    playerScore > dealerScore ? (playerWon = true) : (playerWon = false);
    if (dealerScore === playerScore) {
      isDraw = true;
    }
  }
}

/**
 * @desc Checks scores at the begining of the game and takes appropriate actions.
 */
function doFirstRunChecks() {
  if (dealerScore === playerScore && dealerScore === 21 && playerScore === 21) {
    [gameOver, isDraw] = [true, true];
  }

  if (!isDraw) {
    if (dealerScore === 21) {
      [playerWon, gameOver] = [false, true];
    }
    if (playerScore === 21) {
      [playerWon, gameOver] = [true, true];
    }
  }

  isFirstRun = false;
}

newGameButton.addEventListener("click", function () {
  gameStarted = true;
  gameOver = false;
  playerWon = false;
  isDraw = false;
  isFirstRun = true;

  deck = createDeckOfCards();
  shuffleDeck(deck);
  dealerCards = [getNextCard(), getNextCard()];
  playerCards = [getNextCard(), getNextCard()];

  newGameButton.style.display = "none";
  hitMeButton.style.display = "inline";
  stayButton.style.display = "inline";
  showStatus();
});

hitMeButton.addEventListener("click", function () {
  playerCards.push(getNextCard());
  checkIfItIsEndOfGame();
  showStatus();
});

stayButton.addEventListener("click", function () {
  gameOver = true;
  checkIfItIsEndOfGame();
  showStatus();
});
