import type { DOMElements, GameSession } from "./types";
import { setTarget } from "./targetScripts";
import { smallestDifferenceFromTarget } from "./utils";
import { validateResult } from "./gameLogicMain";

/* 
Set up starting listeners
 */

function _newGameListeners(
  gameSession: GameSession,
  newgameFunction: (a: GameSession) => void
) {
  const { newgameButtons } = gameSession.DOMElements;

  newgameButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      btn.parentElement.parentElement.close();
      newgameFunction(gameSession);
    });
  });
}

function _animateInput(inputElement: Element, value: number) {
  inputElement.classList.add("animate");
  inputElement.textContent = value;

  inputElement.addEventListener(
    "animationend",
    () => {
      inputElement.classList.remove("animate");
    },
    { once: true }
  );
}

function _inputNumberListeners(
  gameSession: GameSession,
  newRoundFunction: (a: GameSession) => void
) {
  const { numberButtons } = gameSession.DOMElements;
  numberButtons.forEach((button) => {
    const { inputNumbers } = gameSession.DOMElements;
    button.addEventListener("click", () => {
      const { currentInputIndex } = gameSession.sessionData;
      const inputNumber = inputNumbers[currentInputIndex];
      _animateInput(inputNumber, button.value);
      gameSession.sessionData.currProduct *= button.value;
      if (gameSession.gameSettings.singleUse) {
        button.disabled = true;
      }
      gameSession.sessionData.currentInputIndex += 1;
      if (gameSession.sessionData.currentInputIndex >= 2) {
        validateResult(gameSession);
        newRoundFunction(gameSession);
      }
    });
  });
}

function hookUpListeners(
  gameSession: GameSession,
  newgameFunction: (a: GameSession) => void,
  newRoundFunction: (a: GameSession) => void
) {
  const { resetButton } = gameSession.DOMElements;
  _newGameListeners(gameSession, newgameFunction);
  _inputNumberListeners(gameSession, newRoundFunction);
  resetButton.addEventListener("click", () => {
    clearInputs(gameSession);
    setInitialButtonState(gameSession);
  });
}

/* 
Other
 */

function _checkResult(gameSession: GameSession) {
  const { currProduct, currTarget, activeButtonsValues } =
    gameSession.sessionData;
  const { singleUse } = gameSession.gameSettings;
  const difference = Math.abs(currProduct - currTarget);
  const smallestDifference = smallestDifferenceFromTarget(
    currTarget,
    activeButtonsValues,
    singleUse
  );
  const points = difference > 5 ? 5 : difference;
  return { points, smallestDifference };
}

function setGameoverMessage(gameSession: GameSession) {
  const { gameoverModal } = gameSession.DOMElements;
  const { totalPoints, minimalPossibleTotalPoints } = gameSession.sessionData;
  const gameoverText = gameoverModal.querySelector(".gameover-text");
  gameoverText.innerHTML = `Obtuviste ${totalPoints} puntos, el puntaje más bajo posible era ${minimalPossibleTotalPoints}.`;
}

function pointsAnimation(addedPoints: number, DOMElements: DOMElements) {
  const { targetElement } = DOMElements;
  const addedPointsElement = targetElement.querySelector(".added-points");
  addedPointsElement.innerHTML = `<p>+${addedPoints}</p>`;
  targetElement.classList.add("animate");
  targetElement.addEventListener(
    "animationend",
    () => {
      targetElement.classList.remove("animate");
    },
    { once: true }
  );
}

function setNewRoundElements(
  gameSession: GameSession,
  gameoverFunction: (a: GameSession) => void
) {
  const { gameSettings } = gameSession;
  const { round } = gameSession.sessionData;
  clearInputs(gameSession);
  setInitialButtonState(gameSession);
  if (round < gameSettings.numberOfRounds) {
    nextRound(gameSession);
    setTarget(gameSession);
  } else {
    gameoverFunction(gameSession);
  }
}

function nextRound(gameSession: GameSession) {
  const { round } = gameSession.sessionData;
  const { roundIndicatorContainer } = gameSession.DOMElements;
  const indicatorsArray =
    roundIndicatorContainer.querySelectorAll(".indicator");
  indicatorsArray[round].classList.add("done");
  gameSession.sessionData.round += 1;
}

function clearInputs(gameSession: GameSession) {
  gameSession.DOMElements.inputNumbers.forEach(
    (input) => (input.textContent = "")
  );
  gameSession.sessionData.currentInputIndex = 0;
  gameSession.sessionData.currProduct = 1;
  return gameSession;
}

function setTimer(
  gameSession: GameSession,
  newroundFunction: (a: GameSession) => void
) {
  const { timerElement } = gameSession.DOMElements;
  const { timerID } = gameSession.sessionData;
  const { gameSettings } = gameSession;
  clearTimeout(timerID);
  timerElement.setAttribute("style", `--duration: ${gameSettings.time}s`);
  timerElement.style.animationName = "none";
  timerElement.offsetWidth;
  timerElement.style.animationName = "timer";
  gameSession.sessionData.timerID = setTimeout(() => {
    newroundFunction(gameSession);
  }, gameSettings.time * 1000);
}

function clearRoundIndicators(DOMElements: DOMElements) {
  const { roundIndicatorContainer } = DOMElements;
  const indicators = roundIndicatorContainer.querySelectorAll(".indicator");
  indicators.forEach((round) => round.classList.remove("done"));
}

function setActiveButtonsValues(gameSession: GameSession) {
  gameSession.sessionData.activeButtonsValues = getActiveButtonsValues();
}

function getActiveButtonsValues() {
  const activeButtons: NodeListOf<HTMLButtonElement> =
    document.querySelectorAll(".number-btn:not([disabled])");
  return Array.from(activeButtons).map((button) => parseInt(button.value));
}

function setInitialButtonState(gameSession: GameSession) {
  const { numberButtons } = gameSession.DOMElements;
  const { disabledNumbers } = gameSession.gameSettings;
  numberButtons.forEach((btn) => {
    btn.disabled = disabledNumbers.includes(parseInt(btn.value));
  });
}

function setRoundIndicators(gameSession: GameSession) {
  const { roundIndicatorContainer } = gameSession.DOMElements;
  const indicatorsHtml = "<div class='indicator'></div>".repeat(
    gameSession.gameSettings.numberOfRounds
  );
  roundIndicatorContainer.innerHTML = indicatorsHtml;
}

export {
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
};
