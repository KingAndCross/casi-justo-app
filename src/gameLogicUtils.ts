import type { DOMElements, GameSession } from "./types";
import { setTarget } from "./targetScripts";
import { smallestDifferenceFromTarget, setAnimation } from "./utils";
import { validateResult } from "./gameLogicMain";

/* 
Set up starting listeners
 */

function _newGameListeners(
  gameSession: GameSession,
  newgameFunction: (a: GameSession, b?: boolean) => void
) {
  const { newgameButtons } = gameSession.DOMElements;

  newgameButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const dialog = btn.parentElement!.parentElement! as HTMLDialogElement;
      dialog.close();
      newgameFunction(gameSession);
    });
  });
}

function _animateInput(inputElement: Element, value: number) {
  inputElement.textContent = `${value}`;
  setAnimation(inputElement);
}

function _inputNumberListeners(
  gameSession: GameSession,
  newRoundFunction: (a: GameSession) => void
) {
  const { numberButtons } = gameSession.DOMElements;
  const numberBtns = numberButtons as NodeListOf<HTMLButtonElement>;
  numberBtns.forEach((button) => {
    const { inputNumbers } = gameSession.DOMElements;
    button.addEventListener("click", () => {
      const btnValue = parseInt(button.value);
      const { currentInputIndex } = gameSession.sessionData;
      const inputNumber = inputNumbers[currentInputIndex];
      _animateInput(inputNumber, btnValue);
      gameSession.sessionData.currProduct *= btnValue;
      if (gameSession.gameSettings.singleUse) {
        button.disabled = true;
      }
      gameSession.sessionData.currentInputIndex += 1;
      if (gameSession.sessionData.currentInputIndex >= 2) {
        setCurrentMultiplication(gameSession);
        validateResult(gameSession);
        newRoundFunction(gameSession);
      }
    });
  });
}

function hookUpListeners(
  gameSession: GameSession,
  newgameFunction: (a: GameSession, b?: boolean) => void,
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
  const productTargetDistance = Math.abs(currProduct - currTarget);
  const smallestDifference = smallestDifferenceFromTarget(
    currTarget,
    activeButtonsValues,
    singleUse
  );
  const difference = productTargetDistance - smallestDifference;
  const points = difference > 5 ? 5 : difference;
  return { points, smallestDifference };
}

function setGameoverMessage(gameSession: GameSession) {
  const { gameoverModal } = gameSession.DOMElements;
  const { totalPoints } = gameSession.sessionData;
  const gameoverText = gameoverModal.querySelector(".gameover-text");
  gameoverText!.innerHTML = `¡Obtuviste ${totalPoints} puntos! (recuerda, entre menos mejor!) Sigue a la siguiente ronda.`;
}

function pointsAnimation(addedPoints: number, DOMElements: DOMElements) {
  const { targetElement } = DOMElements;
  const addedPointsElement = targetElement.querySelector(".added-points");
  if (addedPoints === 0) {
    addedPointsElement!.classList.add("perfect");
  }
  addedPointsElement!.innerHTML = `<p>+${addedPoints}</p>`;
  targetElement.classList.add("animate");
  targetElement.addEventListener(
    "animationend",
    () => {
      targetElement.classList.remove("animate");
      addedPointsElement!.classList.remove("perfect");
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
  if (round < gameSettings.numberOfRounds - 1) {
    nextRound(gameSession);
    setTarget(gameSession);
  } else {
    nextRound(gameSession);
    gameoverFunction(gameSession);
  }
}

function setCurrentMultiplication(gameSession: GameSession) {
  const { currProduct } = gameSession.sessionData;
  const { multiplicationResult } = gameSession.DOMElements;
  multiplicationResult.innerText = currProduct.toString();
  setAnimation(multiplicationResult);
}

function _setIndicatorDoneStatus(gameSession: GameSession) {
  const { round, lastAddedPoints } = gameSession.sessionData;
  const { roundIndicatorContainer } = gameSession.DOMElements;
  const indicatorsArray =
    roundIndicatorContainer.querySelectorAll(".indicator");
  if (lastAddedPoints === 0) {
    indicatorsArray[round].classList.add("perfect");
  }
  indicatorsArray[round].classList.add("done");
}

function nextRound(gameSession: GameSession) {
  _setIndicatorDoneStatus(gameSession);
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
  const numberBtns = numberButtons as NodeListOf<HTMLButtonElement>;
  numberBtns.forEach((btn) => {
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

function sequenceHandler(gameSession: GameSession) {
  const { currentActivityIndex } = gameSession;
  const { activitySequence } = gameSession;

  if (activitySequence !== null && currentActivityIndex !== null) {
    if (currentActivityIndex < activitySequence.length - 1) {
      gameSession.currentActivityIndex! += 1;
      gameSession.gameSettings =
        activitySequence[gameSession.currentActivityIndex!];
    }
  }
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
  sequenceHandler,
};
