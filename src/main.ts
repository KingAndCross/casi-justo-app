import {
  newGame,
  createGameSession,
  openInstructionsModal,
} from "./gameLogicMain";
import { createSequence } from "./settingsProcessing";

document.addEventListener("DOMContentLoaded", () => {
  const gameSequence = createSequence();
  let gameSession = createGameSession(gameSequence);
  openInstructionsModal();
  // newGame(gameSession, true);
});
