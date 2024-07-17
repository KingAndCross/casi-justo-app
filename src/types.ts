interface GameSettings {
  numberOfRounds: number;
  time: number;
  targetRange: [number, number];
  disabledNumbers: number[];
  singleUse: boolean;
  targetNumbers: "exact-results" | "non-exact-results" | "all";
  numberToFocusOn: number[] | null;
  focusStrength: number;
  timeFunction: "constant";
  resultFeedback: boolean;
}

interface DOMElements {
  targetElement: HTMLElement;
  timerElement: HTMLElement;
  resetButton: HTMLElement;
  multiplicationResult: HTMLElement;
  gameoverModal: HTMLDialogElement;
  inputNumbers: NodeListOf<Element>;
  numberButtons: NodeListOf<Element>;
  newgameButtons: NodeListOf<Element>;
  roundIndicatorContainer: HTMLElement;
}

interface SessionData {
  round: number;
  currentInputIndex: 0 | 1 | 2;
  currProduct: number;
  currTarget: number;
  lastAddedPoints: number | null;
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
  activitySequence: GameSettings[] | null;
  currentActivityIndex: number | null;
  firstGame: boolean;
}

export type { SessionData, DOMElements, GameSettings, GameSession };
