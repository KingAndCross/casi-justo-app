import {
  newGame,
  defaultGameSettings,
  createGameSession,
} from "./gameLogicMain";

document.addEventListener("DOMContentLoaded", () => {
  const gameSettings = defaultGameSettings();
  let gameSession = createGameSession(gameSettings);
});
