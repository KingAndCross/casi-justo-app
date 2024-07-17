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
    case "low-numbers":
      settings.targetRange = [10, 50];
      break;
    case "high-numbers":
      settings.targetRange = [50, 144];
      break;
    case "fast-pace":
      settings.time = 8;
      break;
    case "thirt-fifties-focus":
      settings.numberToFocusOn = [30, 50];
      break;
    case "all-off":
      settings.targetNumbers = "non-exact-results";
      break;
    case "the-tables":
      settings.targetNumbers = "exact-results";
      break;
    case "the-hard-tables":
      settings.disabledNumbers = [1, 2, 5, 10];
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
