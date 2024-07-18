import { GameSettings } from "./types";
import { getQueryParameters, setSequenceArray } from "./utils";
/* In the future add  fine grained control */

function _defaultGameSettings(): GameSettings {
  const defaultGameSettings: GameSettings = {
    numberOfRounds: 5,
    time: 15,
    targetRange: [10, 144],
    disabledNumbers: [],
    singleUse: false,
    targetNumbers: "all",
    numberToFocusOn: null,
    focusStrength: 1,
    timeFunction: "constant",
    resultFeedback: false,
  };
  return defaultGameSettings;
}

function namedSettings(
  settingString: string,
  settings: GameSettings
): GameSettings {
  switch (settingString) {
    case "low-targets":
      settings.targetRange = [10, 50];
      break;
    case "high-targets":
      settings.targetRange = [50, 144];
      break;
    case "slow-pace":
      settings.time = 25;
      break;
    case "fast-pace":
      settings.time = 8;
      break;
    case "ten-rounds":
      settings.numberOfRounds = 10;
      break;
    case "thirt-fifties-focus":
      settings.numberToFocusOn = [30, 50];
      break;
    case "non-exact-targets":
      settings.targetNumbers = "non-exact-results";
      break;
    case "exact-targets":
      settings.targetNumbers = "exact-results";
      break;
    case "non-easy-factors":
      settings.disabledNumbers = [1, 2, 5, 10];
      break;
    case "non-hard-factors":
      settings.disabledNumbers = [6, 7, 8, 12];
      break;
    case "non-squares":
      settings.singleUse = true;
      break;
  }
  return settings;
}

function createSettings(parameters: string[]): GameSettings {
  let settings = _defaultGameSettings();
  for (const parameter of parameters) {
    settings = namedSettings(parameter, settings);
  }
  return settings;
}

function createSequence(): GameSettings[] {
  const parameters = getQueryParameters();
  const sequenceParametersArray = setSequenceArray(parameters);
  let sequenceSettingsArray = [];

  for (const parameters of sequenceParametersArray) {
    sequenceSettingsArray.push(createSettings(parameters));
  }
  return sequenceSettingsArray;
}

export { createSettings, createSequence };
