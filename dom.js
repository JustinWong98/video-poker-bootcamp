/* eslint-disable no-undef */
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
  // eslint-disable-next-line no-use-before-define
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
