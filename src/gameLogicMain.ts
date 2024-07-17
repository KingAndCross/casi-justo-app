import type {
  SessionData,
  DOMElements,
  GameSession,
  GameSettings,
} from "./types";
import { setTarget } from "./targetScripts";

import {
  setRoundIndicators,
  clearRoundIndicators,
  setInitialButtonState,
  setActiveButtonsValues,
  setTimer,
  clearInputs,
  setGameoverMessage,
  getActiveButtonsValues,
  pointsAnimation,
  _checkResult,
  setNewRoundElements,
  hookUpListeners,
} from "./gameLogicUtils";

/* 
============================= 
Game instance creation  
============================= 
*/

function defaultGameSettings(): GameSettings {
  const defaultGameSettings: GameSettings = {
    numberOfRounds: 5,
    time: 15,
    targetRange: [10, 144],
    disabledNumbers: [1, 2, 5, 10],
    singleUse: true,
    targetNumbers: "all",
    numberToFocusOn: null,
    focusStrength: 1,
    timeFunction: "constant",
    resultFeedback: false,
  };
  return defaultGameSettings;
}

function _getDOMElements(): DOMElements {
  const multiplicationResult = document.querySelector(".multiplication-result");
  const inputNumbers = document.querySelectorAll(".input-number");
  const numberButtons = document.querySelectorAll(".number-btn");
  const resetButton = document.querySelector(".reset-btn");
  const targetElement = document.querySelector(".target-container");
  const newgameButtons = document.querySelectorAll(".newgame-btn");
  const gameoverModal = document.getElementById("gameover-modal");
  const timerElement = document.querySelector(".timer");
  const roundIndicatorContainer = document.querySelector(".rounds-indicators");

  const htmlElements = [
    targetElement,
    timerElement,
    resetButton,
    roundIndicatorContainer,
    multiplicationResult,
  ];
  const htmlNodeList = [numberButtons, inputNumbers, newgameButtons];

  if (htmlElements.some((el) => !(el instanceof HTMLElement))) {
    throw new Error("One or more HTMLElements are not in the DOM");
  }

  if (htmlNodeList.some((el) => !(el instanceof NodeList))) {
    throw new Error("One or more NodeList are not in the DOM");
  }

  return {
    multiplicationResult: multiplicationResult as HTMLElement,
    targetElement: targetElement as HTMLElement,
    timerElement: timerElement as HTMLElement,
    resetButton: resetButton as HTMLElement,
    roundIndicatorContainer: roundIndicatorContainer as HTMLElement,
    numberButtons: numberButtons as NodeListOf<Element>,
    inputNumbers: inputNumbers as NodeListOf<Element>,
    newgameButtons: newgameButtons as NodeListOf<Element>,
    gameoverModal: gameoverModal as HTMLDialogElement,
  };
}

function _defaultSessionData(): SessionData {
  const activeButtonsValues = getActiveButtonsValues();
  return {
    round: 0,
    currentInputIndex: 0,
    currProduct: 1,
    currTarget: 1,
    lastAddedPoints: 0,
    totalPoints: 0,
    minimalPossibleTotalPoints: 0,
    timerID: undefined,
    delay: 300,
    activeButtonsValues: activeButtonsValues,
  };
}

function openInstructionsModal() {
  const instructionsModal = document.getElementById(
    "instructions-modal"
  ) as HTMLDialogElement;
  instructionsModal.showModal();
}

/* 
============================= 
Main logic 
============================= 
*/

function createGameSession(gameSettings: GameSettings): GameSession {
  let gameSession: GameSession = {
    sessionData: _defaultSessionData(),
    DOMElements: _getDOMElements(),
    gameSettings: gameSettings,
  };
  hookUpListeners(gameSession, newGame, newRound);
  return gameSession;
}

function newGame(gameSession: GameSession): void {
  gameSession.sessionData = _defaultSessionData();
  setRoundIndicators(gameSession);
  clearRoundIndicators(gameSession.DOMElements);
  setInitialButtonState(gameSession);
  setActiveButtonsValues(gameSession);
  setTimer(gameSession, newRound);
  clearInputs(gameSession);
  setTarget(gameSession);
}

function newRound(gameSession: GameSession) {
  setTimer(gameSession, newRound);
  setTimeout(() => {
    setNewRoundElements(gameSession, gameOver);
  }, gameSession.sessionData.delay);
}

function validateResult(gameSession: GameSession) {
  const { points, smallestDifference } = _checkResult(gameSession);
  gameSession.sessionData.lastAddedPoints = points;
  gameSession.sessionData.minimalPossibleTotalPoints += smallestDifference;
  pointsAnimation(points, gameSession.DOMElements);
}

function gameOver(gameSession: GameSession) {
  const { gameoverModal, timerElement } = gameSession.DOMElements;
  const { timerID } = gameSession.sessionData;
  setGameoverMessage(gameSession);
  gameoverModal.showModal();
  clearTimeout(timerID);
  timerElement.style.visibility = "hidden";
  timerElement.style.animationName = "none";
  timerElement.offsetWidth;
}

export {
  newGame,
  validateResult,
  gameOver,
  newRound,
  defaultGameSettings,
  createGameSession,
  openInstructionsModal,
};
