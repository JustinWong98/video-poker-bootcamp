/* eslint-disable no-unused-vars */
/* eslint-disable no-use-before-define */
/* eslint-disable no-undef */
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
