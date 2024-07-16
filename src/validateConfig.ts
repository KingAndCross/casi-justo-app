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
