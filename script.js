/* eslint-disable no-unused-vars */
/* eslint-disable no-use-before-define */

// Player points and bet
let playerPoints = 50;
let playerBet = 0;
// Game data arrays and objects to help in calcHandScore
const hand = [];
// GAME MODE GLOBAL VALUES
let canRedraw = true;
let canClick = false;
// to help clear prev hand if not first game
let toClearPrevHand = false;

/**
 * sound FX
 */
const playAudio = (sound) => {
  const gameSound = document.createElement('audio');
  gameSound.src = sound;
  gameSound.play();
};

/**
 * @function takes an array of card objects
 * @param cards in hand
 * @returns Number of points user has scored in hand
 */
const calcHandScore = () => {
  pointsCounter.innerText = `Your current points: ${playerPoints}`;
  // check winning conditions
  winningConditionsCheck();
  playerBet = 0;
  // redraw DOM elements to update and prepare for next round
  betDisplayText.innerText = `Your current bet is ${playerBet}`;
  buttonDiv.appendChild(betInputReset);
  buttonDiv.appendChild(betInputMin);
  buttonDiv.appendChild(betInputMax);
  buttonDiv.appendChild(dealButton);
  toClearPrevHand = true;
  buttonDiv.removeChild(returnButton);
  pointsCounter.innerText = `Your current points: ${playerPoints}`;
  // reinitialize tallies and array for next round
  // add win or lose text
  outputMsgDiv.classList.add('outputMsgDiv');
  outputMsgDiv.classList.add('centerAligned');
  outputMsgDiv.appendChild(winText);
  // If playerPoints = 0, create a message that it is game over and for them to restart
  if (playerPoints <= 0) {
    loseMessage();
  }
};

// Get a random index ranging from 0 (inclusive) to max (exclusive).
const getRandomIndex = (max) => Math.floor(Math.random() * max);

// Shuffle an array of cards
const shuffleCards = (cards) => {
  // Loop over the card deck array once
  for (let currentIndex = 0; currentIndex < cards.length; currentIndex += 1) {
    // Select a random index in the deck
    const randomIndex = getRandomIndex(cards.length);
    // Select the card that corresponds to randomIndex
    const randomCard = cards[randomIndex];
    // Select the card that corresponds to currentIndex
    const currentCard = cards[currentIndex];
    // Swap positions of randomCard and currentCard in the deck
    cards[currentIndex] = randomCard;
    cards[randomIndex] = currentCard;
  }
  // Return the shuffled deck
  return cards;
};

/**
 *
 * @param {*} cardInfo to find out the name and suit of the card
 * @returns the pathway to the PNG image file for that card
 */
const imageAllocation = (cardInfo) => {
  let myOutputValue = '';
  myOutputValue = `PNG/${cardInfo.displayName}${cardInfo.suit}.png`;
  return myOutputValue;
};

const makeDeck = () => {
  // Initialise an empty deck array
  const newDeck = [];
  // Initialise an array of the 4 suits in our deck. We will loop over this array.
  const suits = ['hearts', 'diamonds', 'clubs', 'spades'];
  const suitSymbols = ['♥️', '♦️', '♣️', '♠️'];

  // Loop over the suits array
  for (let suitIndex = 0; suitIndex < suits.length; suitIndex += 1) {
    // Store the current suit in a variable
    const currentSuit = suits[suitIndex];
    const currentSuitSymbol = suitSymbols[suitIndex];

    // Loop from 1 to 13 to create all cards for a given suit
    // Notice rankCounter starts at 1 and not 0, and ends at 13 and not 12.
    // This is an example of a loop without an array.
    for (let rankCounter = 1; rankCounter <= 13; rankCounter += 1) {
      // By default, the card name is the same as rankCounter
      let cardName = `${rankCounter}`;
      let cardDisplayName = `${rankCounter}`;
      let colour = '';
      if (suitIndex <= 1) {
        colour = 'red';
      }
      else {
        colour = 'black';
      }

      // If rank is 1, 11, 12, or 13, set cardName to the ace or face card's name
      if (cardName === '1') {
        cardName = 'ace';
        cardDisplayName = 'A';
      } else if (cardName === '11') {
        cardName = 'jack';
        cardDisplayName = 'J';
      } else if (cardName === '12') {
        cardName = 'queen';
        cardDisplayName = 'Q';
      } else if (cardName === '13') {
        cardName = 'king';
        cardDisplayName = 'K';
      }

      // Create a new card with the current name, suit, and rank
      const cardInfo = {
        name: cardName,
        displayName: cardDisplayName,
        suit: currentSuit,
        rank: rankCounter,
        cardColour: colour,
        suitSymbol: currentSuitSymbol,
      };

      if (cardInfo.name === 'ace') {
        cardInfo.rank = 14;
      }

      cardInfo.cardImage = imageAllocation(cardInfo);

      // Add the new card to the deck
      newDeck.push(cardInfo);
    }
  }

  // Return the completed card deck
  return newDeck;
};

let deck = shuffleCards(makeDeck());

//* * HAND SCORE LOGIC */

const playerHandTally = (cardNameTally, cardSuitTally) => {
  for (let i = 0; i < hand.length; i += 1) {
    const cardName = hand[i].name;
    const cardSuit = hand[i].suit;
    // If we have seen the card name before, increment its count
    if (cardName in cardNameTally) {
      cardNameTally[cardName] += 1;
    }
    // Else, initialise count of this card name to 1
    else {
      cardNameTally[cardName] = 1;
    }
    // Do this for the suit as well
    if (cardSuit in cardSuitTally) {
      cardSuitTally[cardSuit] += 1;
    }
    else {
      cardSuitTally[cardSuit] = 1;
    }
  }
};

/**
 * @description Check for both 1 pair (in case of full house) or 2 pair (winning hand)
 */
const checkForPair = (cardTallyKeyArray, cardNameTally) => {
  for (let i = 0; i < cardTallyKeyArray.length; i += 1) {
    const cardNameInTally = cardTallyKeyArray[i];
    if (cardNameTally[cardNameInTally] === 2) {
      return true;
    }
  }
  return false;
};
const checkForTwoPair = (cardTallyKeyArray, cardNameTally) => {
  let hasOnePair = false;
  for (let i = 0; i < cardTallyKeyArray.length; i += 1) {
    const cardNameInTally = cardTallyKeyArray[i];
    if (cardNameTally[cardNameInTally] === 2) {
      if (hasOnePair) {
        return true;
      }

      hasOnePair = true;
    }
  }
  return false;
};
/**
 * @description Check for 3 of a kind
 */
const checkForThreeOfAKind = (cardTallyKeyArray, cardNameTally) => {
  for (let i = 0; i < cardTallyKeyArray.length; i += 1) {
    const cardNameInTally = cardTallyKeyArray[i];
    if (cardNameTally[cardNameInTally] === 3) {
      return true;
    }
  }
  return false;
};

/**
 * @description Check if 4 of a kind
 */
const checkForFourOfAKind = (cardTallyKeyArray, cardNameTally) => {
  for (let i = 0; i < cardTallyKeyArray.length; i += 1) {
    const cardNameInTally = cardTallyKeyArray[i];
    if (cardNameTally[cardNameInTally] === 4) {
      return true;
    }
  }
  return false;
};

/**
 * @description Check if all cards have same suit
 */
const checkForFlush = (cardSuitTally, cardSuitKeyArray) => {
  if (cardSuitTally[cardSuitKeyArray[0]] === 5) {
    return true;
  }
  return false;
};

/**
 * @description Check if all cards have a diff of 1 after sorting in ascending order
 */
const checkForStraight = (valueArray) => {
  for (let i = 0; i < hand.length; i += 1) {
    valueArray.push(hand[i].rank);
  }
  valueArray.sort((a, b) => a - b);
  for (let i = 0; i < valueArray.length - 1; i += 1) {
    if (Math.abs(valueArray[i] - valueArray[i + 1]) !== 1) {
      return false;
    }
  }
  return true;
};

/**
 * @description Check if straight and flush are both true and the lowest ranked card is a 10
 */
const checkforRoyalFlush = (valueArray) => {
  valueArray.sort((a, b) => a - b);
  if (valueArray[0] === 10) {
    return true;
  }
  return false;
};

const winTextChange = (textHere) => {
  winText.innerText = textHere;
};

const winningConditionsCheck = () => {
  const cardNameTally = {};
  const cardSuitTally = {};
  playerHandTally(cardNameTally, cardSuitTally);
  const cardTallyKeyArray = Object.keys(cardNameTally);
  const cardSuitKeyArray = Object.keys(cardSuitTally);
  const valueArray = [];
  for (let i = 0; i < hand.length; i += 1) {
    valueArray.push(hand[i].rank);
  }
  // canClick set to false so they cant click on cards after redraw
  canClick = false;
  // default winText means loss
  winText.innerText = 'You lost :(';
  if (checkForFlush(cardSuitTally, cardSuitKeyArray) && checkForStraight(valueArray)) {
    if (checkforRoyalFlush(valueArray)) {
      const royalFlushText = 'You got a royal Flush! OMG! 100x POINTS!';
      winTextChange(royalFlushText);
      playerPoints = playerBet * 100;
    }
    else {
      const straightFlushText = 'You have gotten a straight flush! 50x Points!';
      winTextChange(straightFlushText);
      playerPoints = playerBet * 50;
    }
  }
  else if (checkForFlush(cardSuitTally, cardSuitKeyArray)) {
    const flushText = `You have gotten a flush with 5 cards of ${cardSuitKeyArray[0]}! x6 Points!`;
    winTextChange(flushText);
    playerPoints += playerBet * 6;
  }
  else if (checkForStraight(valueArray)) {
    const straightText = 'You have gotten a straight! x4 Points!';
    winTextChange(straightText);
    playerPoints += playerBet * 4;
  }
  else if (checkForFourOfAKind(cardTallyKeyArray, cardNameTally)) {
    const fourOfaKindText = 'You have gotten 4 of a kind! x25 Points!';
    winTextChange(fourOfaKindText);
    playerPoints += playerBet * 25;
  }
  else if (checkForThreeOfAKind(cardTallyKeyArray, cardNameTally)
  && checkForPair(cardTallyKeyArray, cardNameTally)) {
    const fullHouseText = 'You have gotten a full house! x9 Points!';
    winTextChange(fullHouseText);
    playerPoints += playerBet * 9;
  }
  else if (checkForThreeOfAKind(cardTallyKeyArray, cardNameTally)) {
    const threeOfAKindText = 'You have gotten 3 of a kind! x3 Points!';
    winTextChange(threeOfAKindText);
    playerPoints += playerBet * 3;
  }
  else if (checkForTwoPair(cardTallyKeyArray, cardNameTally)) {
    const twoPairText = 'You have gotten 2 pairs! x2 Points!';
    winTextChange(twoPairText);
    playerPoints += playerBet * 2;
  }
  if (winText.innerText === 'You lost :(') {
    playAudio('loseSound.mp4');
  }
  else {
    playAudio('winSound.mp4');
  }
};
/**
 * @description if player loses all points
 */
const loseMessage = () => {
  // Change message
  betDisplayText.innerText = 'You have lost all your points! Do you wish to restart?';
  // Clear bet buttons
  const betButtons = document.querySelector('.buttonDiv');
  betButtons.innerHTML = '';
  // Add button to reset game
  const resetGameButton = document.createElement('button');
  resetGameButton.classList.add('gameText');
  resetGameButton.innerText = 'Restart?';
  betButtons.appendChild(resetGameButton);
  // reset Game
  resetGameButton.addEventListener('click', (() => {
    // reset Player Points
    playerPoints = 50;
    // reset buttons
    betButtons.removeChild(resetGameButton);
    betButtons.appendChild(betInputReset);
    betButtons.appendChild(betInputMin);
    betButtons.appendChild(betInputMax);
    betButtons.appendChild(dealButton);
    // clear lose message and reinitialize texts
    outputMsgDiv.innerHTML = '';
    outputMsgDiv.classList.remove('outputMsgDiv');
    pointsCounter.innerText = `Your current points: ${playerPoints}`;
    betDisplayText.innerText = `Your current bet is ${playerBet}`;
  }));
};

/**
 *
 * @param {Our card element that is shown} card
 * @param {The card that is drawn from the deck} drawnCard
 * @description The purpose is to transfer the object properties and show it in HTML
 * // Pass in the index of the card
 */
const cardCreation = (card, drawnCard) => {
  card.classList.add('card');
  if (canRedraw === true) {
    card.classList.add('to-remove');
    card.addEventListener('click', (() => {
      if (canClick === true) {
        card.classList.toggle('to-remove');
      }
    }));
  }
  const cardName = document.createElement('div');
  cardName.classList.add('name');
  cardName.innerText = drawnCard.displayName;
  const cardSuit = document.createElement('div');
  cardSuit.classList.add('suit');
  cardSuit.innerText = drawnCard.suitSymbol;
  const cardImageDisplay = document.createElement('img');
  cardImageDisplay.src = drawnCard.cardImage;
  cardImageDisplay.classList.add('cardImage');
  if (drawnCard.cardColour === 'red') {
    cardName.classList.add('red');
    cardSuit.classList.add('red');
  }
  else {
    cardName.classList.add('black');
    cardSuit.classList.add('black');
  }
  if (canRedraw === true) {
    card.appendChild(cardImageDisplay);
    cardTable.appendChild(card);
  }
};
/**
 * deal the cards and adding to hand array
 */
const dealCards = () => {
  // remove prev messages if any
  outputMsgDiv.innerHTML = '';
  outputMsgDiv.classList.remove('outputMsgDiv');
  // to make sure player cant click card before animation is finished
  // set canClick (to choose to keep card) to false for 1s
  canClick = false;
  setTimeout(() => {
    canClick = true;
  }, 1000);
  canRedraw = true;
  // if not first game, clear prev hand
  if (toClearPrevHand) {
    // clear hand
    for (let i = 0; i < 5; i += 1) {
      hand.pop();
    }
    // reshuffle deck
    deck = shuffleCards(makeDeck());
    // remove card container divs
    const cardParent = document.querySelector('.card').parentElement;
    cardParent.querySelectorAll('.card').forEach((n) => n.remove());
    toClearPrevHand = false;
  }
  // update Player points
  playerPoints -= playerBet;
  pointsCounter.innerText = `Your current points: ${playerPoints}`;
  // remove bet buttons
  buttonDiv.removeChild(dealButton);
  buttonDiv.removeChild(betInputReset);
  buttonDiv.removeChild(betInputMin);
  buttonDiv.removeChild(betInputMax);
  // draw 5 cards
  for (let i = 0; i < 5; i += 1) {
    hand.push(deck.pop());
    const firstDrawnCard = hand[i];
    const firstCard = document.createElement('div');
    cardCreation(firstCard, firstDrawnCard);
  }
  // play draw sound
  playAudio('drawSound.mp4');
};

/**
 * redrawing cards by replacing both the text in the DOM as well as the hand array
 */
const redrawCards = () => {
  canRedraw = false;
  // select cards that did not get chosen to be kept
  const replaceCards = document.querySelectorAll('.to-remove');
  // select card element
  const cardElementSelector = [...document.querySelectorAll('#cardTable > .card')];
  for (let i = 0; i < replaceCards.length; i += 1) {
    // draw new card for each card chosen to be replaced
    const redrawnCard = deck.pop();
    // change image to new card
    replaceCards[i].querySelector('.cardImage').src = redrawnCard.cardImage;
    const newCardImage = replaceCards[i].querySelector('.cardImage');
    // change animation to enter from bottom
    newCardImage.classList.add('enter-bottom');
    // select which position is the be replaced using indexOf to find the card being removed
    const replacingPosition = cardElementSelector.indexOf(document.querySelector('.to-remove'));
    // replace that card in the array with the new one
    hand.splice(replacingPosition, 1, redrawnCard);
    replaceCards[i].classList.remove('to-remove');
    replaceCards[i].classList.add('redrawn-card');
  }
  calcHandScore(hand);
  playAudio('drawSound.mp4');
};

// DOM MANIPULATION
const dealButton = document.createElement('button');
dealButton.innerText = 'Deal!';
dealButton.classList.add('centerAligned');
dealButton.classList.add('gameText');
dealButton.classList.add('betButton');

const betDisplayDiv = document.createElement('div');
const betDisplayText = document.createElement('p');
betDisplayText.innerText = `Your current bet is ${playerBet}`;
betDisplayDiv.classList.add('betDisplay');
betDisplayDiv.classList.add('centerAligned');
betDisplayDiv.classList.add('gameText');
betDisplayDiv.appendChild(betDisplayText);

const betInputReset = document.createElement('button');
betInputReset.innerText = 'RESET BET';
betInputReset.classList.add('gameText');
betInputReset.addEventListener('click', (() => {
  playerBet = 0;
  betDisplayText.innerText = `Your current bet is ${playerBet}`;
}));

const betInputMin = document.createElement('button');
betInputMin.innerText = '+1';
betInputMin.classList.add('gameText');
betInputMin.classList.add('betButton');
betInputMin.addEventListener('click', (() => {
  playerBet += 1;
  if (playerBet > playerPoints) {
    playerBet = playerPoints;
  }
  betDisplayText.innerText = `Your current bet is ${playerBet}`;
}));

const betInputMax = document.createElement('button');
betInputMax.innerText = '+10';
betInputMax.classList.add('gameText');
betInputMax.classList.add('betButton');
betInputMax.addEventListener('click', (() => {
  playerBet += 10;
  if (playerBet > playerPoints) {
    playerBet = playerPoints;
  }
  betDisplayText.innerText = `Your current bet is ${playerBet}`;
}));

dealButton.addEventListener('click', (() => { dealCards();
  buttonDiv.appendChild(returnButton); }));

const cardTable = document.createElement('div');
cardTable.id = 'cardTable';

const returnButton = document.createElement('button');
returnButton.innerText = 'Redraw/Hold';
returnButton.classList.add('gameText');
returnButton.addEventListener('click', redrawCards);

const pointsCounter = document.createElement('p');
pointsCounter.innerText = `Your current points: ${playerPoints}`;
pointsCounter.classList.add('gameText');

const winText = document.createElement('p');
winText.innerText = '';
winText.classList.add('gameText');

const mainDiv = document.createElement('div');
mainDiv.classList.add('mainDiv');
mainDiv.classList.add('centerAligned');
document.body.appendChild(mainDiv);

const buttonDiv = document.createElement('div');
buttonDiv.classList.add('buttonDiv');
buttonDiv.appendChild(betInputReset);
buttonDiv.appendChild(betInputMin);
buttonDiv.appendChild(betInputMax);
buttonDiv.appendChild(dealButton);

const pointsDisplayDiv = document.createElement('div');
pointsDisplayDiv.classList.add('pointsDisplayDiv');
pointsDisplayDiv.classList.add('centerAligned');

const outputMsgDiv = document.createElement('div');

mainDiv.appendChild(cardTable);
pointsDisplayDiv.appendChild(pointsCounter);
document.body.appendChild(pointsDisplayDiv);
document.body.appendChild(outputMsgDiv);
document.body.appendChild(buttonDiv);
document.body.appendChild(betDisplayDiv);
