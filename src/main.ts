document.addEventListener("DOMContentLoaded", (event) => {
  const numberButtons = document.querySelectorAll(".number-btn");
  const inputNumbers = document.querySelectorAll(".input-number");
  const resetButton = document.querySelector(".reset-btn");
  const targetNumber = document.querySelector(".target-number");
  const pointsPopup = document.querySelector(".points-pop-up");
  const newgameButtons = document.querySelectorAll(".newgame-btn");
  const gameoverModal = document.getElementById("gameover-modal");
  const timerElement = document.querySelector(".timer");

  let roundIndicator;
  let activeValues;

  let gameSettings = {
    numberOfRounds: 5,
    time: 15,
    targetRange: [10, 144],
    disabledNumbers: [1, 2, 5, 10],
    singleUse: true,
    targetNumbers: "all",
    numberToFocusOn: [49, 56],
    focusStrength: 1,
    timeFunction: "constant",
    resultFeedback: false,
  };

  function getAndRemoveQueryParameters() {
    const currentUrl = window.location.href.split("?");
    const urlWithoutQuery = currentUrl[0];
    //history.replaceState(null, "", urlWithoutQuery);
    return currentUrl[1];
  }

  function validateGameSettings(paramsString) {
    const settings = new URLSearchParams(paramsString);
    gameSettings.numberOfRounds = settings.get("r") || 8;
    gameSettings.time = settings.get("t") || 15;
    gameSettings.targetRange = settings.get("tr") || [2, 144];
    gameSettings.disabledNumbers = settings.get("dn") || [1, 2, 5, 10];
    gameSettings.singleUse = settings.get("su") || false;
    gameSettings.targetNumbers = settings.get("tn") || "all";
    gameSettings.numberToFocusOn = settings.get("fo") || [49, 56];
    gameSettings.focusStrength = settings.get("fs") || 1;
  }

  function _validate(settingsObject, queryName, inputType, defaultValue) {
    settingsObject.get(queryName);
  }

  const configSettings = getAndRemoveQueryParameters();
  validateGameSettings(configSettings);
  /* 
    uniqueFactors - every button can only be pressed once.
    time - number. time in seconds.
    timeFunction - constant | linear-decrease | smooth-decrease.
    disabledNumbers - array of numbers that are permanently disabled.
    targetRange - tuple of range of numbers.
    targetNumbers: "exact-results", "non-exact-results", "all".
    onlyPerfect - bool. all numbers are the product of available numbers. 
    onlyOffNumbers - bool. none of the numbers are the product of available numbers. 
    resultFeedback - bool. gives detailed result report.
    numberToFocusOn - tuple focus on some tables with a certain prob array of arrays?
    focusStrength - stdev to use when selecting a numbertofocuson,
  */

  let round = 0;
  let product = 1;
  let target;

  let timerID;

  let points = 0;
  let minimalPossiblePoints = 0;
  let inputIndex = 0;

  function updateActiveValues() {
    const activeButtons = document.querySelectorAll(
      ".number-btn:not([disabled])"
    );
    activeValues = Array.from(activeButtons).map((button) => button.value);
  }

  function setInitialButtonState() {
    numberButtons.forEach((btn) => {
      btn.disabled = gameSettings.disabledNumbers.includes(parseInt(btn.value));
    });
  }

  function setRoundIndicators() {
    const indicatorsHtml = "<div class='indicator'></div>".repeat(
      gameSettings.numberOfRounds
    );
    document.querySelector(".rounds-indicators").innerHTML = indicatorsHtml;
    roundIndicator = document.querySelectorAll(".indicator");
  }

  function clearRoundIndicators() {
    roundIndicator.forEach((round) => round.classList.remove("done"));
  }

  newgameButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      btn.parentElement.parentElement.close();
      newGame();
    });
  });

  numberButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const inputNumber = inputNumbers[inputIndex];
      inputNumber.textContent = button.value;
      product *= button.value;

      if (gameSettings.singleUse) {
        button.disabled = true;
      }

      inputIndex++;

      inputNumber.classList.add("animate");

      inputNumber.addEventListener(
        "animationend",
        () => {
          inputNumber.classList.remove("animate");
        },
        { once: true }
      );
      if (inputIndex >= 2) {
        checkResult();
        newRound();
      }
    });
  });

  resetButton.addEventListener("click", clearInputs);

  function checkResult() {
    const difference = Math.abs(product - target);
    const addedPoints = difference > 5 ? 5 : difference;
    pointsAnimation(addedPoints);
    points += addedPoints;
    minimalPossiblePoints += smallestDifferenceFromTarget(target);
  }

  function newGame() {
    round = 0;
    points = 0;
    minimalPossiblePoints = 0;
    inputIndex = 0;
    setRoundIndicators();
    clearRoundIndicators();
    setInitialButtonState();
    updateActiveValues();
    setTimer();
    clearInputs();
    setTarget();
  }

  function _newRound() {
    clearInputs();
    setInitialButtonState();
    if (round < gameSettings.numberOfRounds) {
      nextRound();
      setTarget();
    } else {
      gameOver();
    }
  }

  function gameOver() {
    gameoverMessage();
    gameoverModal.showModal();
    clearTimeout(timerID);
    timerElement.style.visibility = "hidden";
    timerElement.style.animationName = "none";
    timerElement.offsetWidth;
  }

  function newRound(delay = 200) {
    setTimer();
    setTimeout(() => {
      _newRound();
    }, delay);
  }

  function clearInputs() {
    inputNumbers.forEach((input) => (input.textContent = ""));
    inputIndex = 0;
    product = 1;
  }

  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  function _gaussianRandom(mean = 0, stdev = 1) {
    const u = 1 - Math.random();
    const v = Math.random();
    const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
    return z * stdev + mean;
  }

  function _clampIntInRange(number, range) {
    const [min, max] = range;
    const roundedNumber = Math.round(number);
    if (roundedNumber < min) {
      return min;
    } else if (roundedNumber > max) {
      return max;
    } else {
      return roundedNumber;
    }
  }

  function getRandomIntBinomial() {
    const { numberToFocusOn, focusStrength, targetRange } = gameSettings;
    const selectedNumber =
      numberToFocusOn[Math.floor(Math.random() * numberToFocusOn.length)];
    const normalRandom = _gaussianRandom(selectedNumber, focusStrength);
    return _clampIntInRange(normalRandom, targetRange);
  }

  function _setTarget() {
    let target = getRandomInt(...gameSettings.targetRange);
    if (!Object.is(gameSettings.numberToFocusOn, null)) {
      target = getRandomIntBinomial();
    }
    let smallestDiff = smallestDifferenceFromTarget(target);
    return [target, smallestDiff];
  }

  function setTarget() {
    // the function tries to match the preference.
    let maxTries = 1000;
    const { targetNumbers } = gameSettings;
    [target, smallestDiff] = _setTarget();
    if (targetNumbers === "exact-results") {
      while (smallestDiff != 0 || maxTries === 0) {
        [target, smallestDiff] = _setTarget();
        maxTries -= 1;
      }
    } else if (targetNumbers === "non-exact-results") {
      while (smallestDiff === 0 || maxTries === 0) {
        [target, smallestDiff] = _setTarget();
        maxTries -= 1;
      }
    }
    targetNumber.innerHTML = `<p>${target}</p>`;
  }

  function nextRound() {
    roundIndicator[round].classList.add("done");
    round += 1;
  }

  function setTimer() {
    clearTimeout(timerID);
    timerElement.style = `--duration: ${gameSettings.time}s`;
    timerElement.style.animationName = "none";
    timerElement.offsetWidth;
    timerElement.style.animationName = "timer";
    timerID = setTimeout(() => {
      newRound();
      console.log("fin del tiempo siguiente ronda");
    }, gameSettings.time * 1000);
  }

  function pointsAnimation(addedPoints) {
    const msg = (() => {
      if (addedPoints === 0) {
        return "¡Justo!";
      } else if (addedPoints < 4) {
        return "¡Casi!";
      } else {
        return "";
      }
    })();
    pointsPopup.innerHTML = `
        <h3>${msg}</h3>
        <h3>+${addedPoints}</h3>
    `;

    pointsPopup.classList.add("animate");

    pointsPopup.addEventListener(
      "animationend",
      () => {
        pointsPopup.classList.remove("animate");
      },
      { once: true }
    );
  }

  function smallestDifferenceFromTarget(target) {
    let smallestDifference = 5;
    const nosquares = gameSettings.singleUse;
    for (let i = 0; i < activeValues.length; i++) {
      for (let j = i + nosquares; j < activeValues.length; j++) {
        const product = activeValues[i] * activeValues[j];
        const difference = Math.abs(target - product);
        if (difference === 0) {
          return 0;
        }
        if (difference < smallestDifference) {
          smallestDifference = difference;
        }
      }
    }
    return smallestDifference;
  }

  function gameoverMessage() {
    const gameoverText = gameoverModal.querySelector(".gameover-text");
    gameoverText.innerHTML = `Obtuviste ${points} puntos, el puntaje más bajo posible era ${minimalPossiblePoints}.`;
  }
});
