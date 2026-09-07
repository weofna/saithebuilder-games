export type Color = "red" | "yellow" | "green" | "blue";
export type NumberValue = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
export type ActionValue = "skip" | "reverse" | "draw2";
export type WildValue = "wild" | "wild4";

export type Card =
  | { id: string; kind: "number"; color: Color; value: NumberValue }
  | { id: string; kind: "action"; color: Color; value: ActionValue }
  | { id: string; kind: "wild"; value: WildValue };

export type PlayerId = "you" | "bot";

export type Player = {
  id: PlayerId;
  name: string;
  hand: Card[];
  isBot: boolean;
};

export type GameState = {
  players: Player[];
  turn: number;
  direction: 1 | -1;
  drawPile: Card[];
  discardPile: Card[];
  currentColor: Color;
  pendingDraw: number;
  drewThisTurn: boolean;
  winner: PlayerId | null;
  log: string[];
};

export type Action =
  | { type: "PLAY"; cardId: string; chosenColor?: Color }
  | { type: "DRAW" }
  | { type: "PASS" }
  | { type: "RESTART" };
