import type { Card, GameState } from "./types";

export function topCard(state: GameState): Card {
  return state.discardPile[state.discardPile.length - 1];
}

export function isDrawCard(card: Card): boolean {
  return (
    (card.kind === "action" && card.value === "draw2") ||
    (card.kind === "wild" && card.value === "wild4")
  );
}

export function isPlayable(card: Card, state: GameState): boolean {
  if (state.pendingDraw > 0) {
    return isDrawCard(card);
  }
  if (card.kind === "wild") return true;
  if (card.color === state.currentColor) return true;

  const top = topCard(state);
  if (top.kind === "number" && card.kind === "number" && card.value === top.value) {
    return true;
  }
  if (top.kind === "action" && card.kind === "action" && card.value === top.value) {
    return true;
  }
  return false;
}

export function labelForCard(c: Card): string {
  if (c.kind === "wild") return c.value === "wild4" ? "Wild +4" : "Wild";
  if (c.kind === "action") {
    const v = c.value === "draw2" ? "+2" : c.value === "skip" ? "Skip" : "Reverse";
    return `${c.color} ${v}`;
  }
  return `${c.color} ${c.value}`;
}
