import type { Action, Card, Color, GameState } from "./types";
import { isPlayable } from "./rules";

const ALL_COLORS: Color[] = ["red", "yellow", "green", "blue"];

function scoreCard(card: Card, state: GameState, opponentHandSize: number): number {
  let score = 0;
  if (card.kind === "wild") {
    score += card.value === "wild4" ? 6 : 2;
    score -= 4; // save wilds for later, unless opponent is close to winning
    if (opponentHandSize <= 2) score += 5;
  } else if (card.kind === "action") {
    if (card.value === "draw2") score += 5;
    else score += 3;
    if (opponentHandSize <= 2) score += 3;
  } else {
    score += 1;
  }
  return score;
}

function pickWildColor(hand: Card[], skipCardId: string): Color {
  const counts: Record<Color, number> = { red: 0, yellow: 0, green: 0, blue: 0 };
  for (const c of hand) {
    if (c.id === skipCardId) continue;
    if (c.kind !== "wild") counts[c.color] += 1;
  }
  let best: Color = "red";
  let bestN = -1;
  for (const c of ALL_COLORS) {
    if (counts[c] > bestN) {
      bestN = counts[c];
      best = c;
    }
  }
  return best;
}

function moveFor(card: Card, state: GameState): Action {
  if (card.kind === "wild") {
    const bot = state.players[state.turn];
    return { type: "PLAY", cardId: card.id, chosenColor: pickWildColor(bot.hand, card.id) };
  }
  return { type: "PLAY", cardId: card.id };
}

export function chooseBotMove(state: GameState): Action {
  const bot = state.players[state.turn];

  if (state.drewThisTurn) {
    const drew = bot.hand[bot.hand.length - 1];
    if (isPlayable(drew, state)) return moveFor(drew, state);
    return { type: "PASS" };
  }

  const playable = bot.hand.filter((c) => isPlayable(c, state));
  if (playable.length === 0) return { type: "DRAW" };

  const opponentHand = state.players[(state.turn + 1) % state.players.length].hand.length;
  playable.sort((a, b) => scoreCard(b, state, opponentHand) - scoreCard(a, state, opponentHand));
  return moveFor(playable[0], state);
}
