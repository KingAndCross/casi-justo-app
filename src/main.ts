import { createGameSession, openInstructionsModal } from "./gameLogicMain";
import { createSequence } from "./settingsProcessing";

document.addEventListener("DOMContentLoaded", () => {
  const gameSequence = createSequence();
  createGameSession(gameSequence);
  openInstructionsModal();
});
