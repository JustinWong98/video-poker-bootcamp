// Player points and bet
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
// eslint-disable-next-line prefer-const
let playerPoints = 50;
// eslint-disable-next-line prefer-const
let playerBet = 0;
// Game data arrays and objects to help in calcHandScore
const hand = [];
// GAME MODE GLOBAL VALUES
// eslint-disable-next-line prefer-const
let canRedraw = true;
// eslint-disable-next-line prefer-const
let canClick = false;
// to help clear prev hand if not first game
// eslint-disable-next-line prefer-const
let toClearPrevHand = false;

/**
 * sound FX
 */
const playAudio = (sound) => {
  const gameSound = document.createElement('audio');
  gameSound.src = sound;
  gameSound.play();
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

// eslint-disable-next-line prefer-const
let deck = shuffleCards(makeDeck());
