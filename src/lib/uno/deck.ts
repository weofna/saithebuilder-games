import type { Card, Color, NumberValue } from "./types";

const COLORS: Color[] = ["red", "yellow", "green", "blue"];
const ACTIONS = ["skip", "reverse", "draw2"] as const;

export function createDeck(): Card[] {
  let counter = 0;
  const cid = () => `c${counter++}`;
  const deck: Card[] = [];

  for (const color of COLORS) {
    deck.push({ id: cid(), kind: "number", color, value: 0 });
    for (let n = 1; n <= 9; n++) {
      deck.push({ id: cid(), kind: "number", color, value: n as NumberValue });
      deck.push({ id: cid(), kind: "number", color, value: n as NumberValue });
    }
    for (const v of ACTIONS) {
      deck.push({ id: cid(), kind: "action", color, value: v });
      deck.push({ id: cid(), kind: "action", color, value: v });
    }
  }
  for (let k = 0; k < 4; k++) {
    deck.push({ id: cid(), kind: "wild", value: "wild" });
    deck.push({ id: cid(), kind: "wild", value: "wild4" });
  }
  return deck;
}

export function shuffle<T>(arr: T[]): T[] {
  const copy = arr.slice();
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}
