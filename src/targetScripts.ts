import type { GameSession, GameSettings } from "./types";
import {
  smallestDifferenceFromTarget,
  getRandomInt,
  gaussianRandom,
  clampIntInRange,
} from "./utils";

function _getRandomIntBinomial(gameSettings: GameSettings) {
  const { numberToFocusOn, focusStrength, targetRange } = gameSettings;
  const selectedNumber =
    numberToFocusOn[Math.floor(Math.random() * numberToFocusOn.length)];
  const normalRandom = gaussianRandom(selectedNumber, focusStrength);
  return clampIntInRange(normalRandom, targetRange);
}

function generateTargetCandidate(gameSession: GameSession) {
  const { gameSettings } = gameSession;
  const { activeButtonsValues } = gameSession.sessionData;
  const { targetRange, numberToFocusOn, singleUse } = gameSettings;
  let target = getRandomInt(...targetRange);
  if (!Object.is(numberToFocusOn, null)) {
    target = _getRandomIntBinomial(gameSettings);
  }
  let smallestDiff = smallestDifferenceFromTarget(
    target,
    activeButtonsValues,
    singleUse
  );
  return [target, smallestDiff];
}

function setTarget(gameSession: GameSession) {
  const { gameSettings } = gameSession;
  const { targetElement } = gameSession.DOMElements;
  const { targetNumbers } = gameSettings;
  // the function tries to match the preference.
  let maxTries = 1000;
  let [target, smallestDiff] = generateTargetCandidate(gameSession);
  if (targetNumbers === "exact-results") {
    while (smallestDiff != 0 || maxTries === 0) {
      [target, smallestDiff] = generateTargetCandidate(gameSession);
      maxTries -= 1;
    }
  } else if (targetNumbers === "non-exact-results") {
    while (smallestDiff === 0 || maxTries === 0) {
      [target, smallestDiff] = generateTargetCandidate(gameSession);
      maxTries -= 1;
    }
  }
  const targetText = targetElement.querySelector(".target-number");
  targetText.innerHTML = `<p>${target}</p>`;
  gameSession.sessionData.currTarget = target;
}

export { setTarget };
