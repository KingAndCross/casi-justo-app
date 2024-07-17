import {
  newGame,
  defaultGameSettings,
  createGameSession,
  openInstructionsModal,
} from "./gameLogicMain";

document.addEventListener("DOMContentLoaded", () => {
  const gameSettings = defaultGameSettings();
  let gameSession = createGameSession(gameSettings);
  openInstructionsModal();
  newGame(gameSession);
});
