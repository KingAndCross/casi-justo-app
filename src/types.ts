interface GameSettings {
  numberOfRounds: number;
  time: number;
  targetRange: [number, number];
  disabledNumbers: number[];
  singleUse: boolean;
  targetNumbers: "exact-results" | "non-exact-results" | "all";
  numberToFocusOn: number[];
  focusStrength: number;
  timeFunction: "constant";
  resultFeedback: boolean;
}

interface DOMElements {
  targetElement: HTMLElement;
  timerElement: HTMLElement;
  resetButton: HTMLElement;
  gameoverModal: HTMLDialogElement;
  inputNumbers: NodeListOf<Element>;
  numberButtons: NodeListOf<Element>;
  newgameButtons: NodeListOf<Element>;
  pointsPopup: HTMLElement;
  roundIndicatorContainer: HTMLElement;
}

interface SessionData {
  round: number;
  currentInputIndex: 0 | 1 | 2;
  currProduct: number;
  currTarget: number;
  totalPoints: number;
  minimalPossibleTotalPoints: number;
  timerID: number | undefined;
  delay?: number;
  activeButtonsValues: number[];
}

interface GameSession {
  sessionData: SessionData;
  DOMElements: DOMElements;
  gameSettings: GameSettings;
}

export type { SessionData, DOMElements, GameSettings, GameSession };
