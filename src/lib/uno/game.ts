import type { Action, GameState, Player } from "./types";
import { createDeck, shuffle } from "./deck";
import { isPlayable, labelForCard } from "./rules";

const HAND_SIZE = 7;
const LOG_LIMIT = 8;

function reshuffleIfNeeded(state: GameState): GameState {
  if (state.drawPile.length > 0) return state;
  const top = state.discardPile[state.discardPile.length - 1];
  const rest = state.discardPile.slice(0, -1);
  if (rest.length === 0) {
    return { ...state, drawPile: shuffle(createDeck()) };
  }
  return { ...state, drawPile: shuffle(rest), discardPile: [top] };
}

function drawN(state: GameState, playerIdx: number, n: number): GameState {
  let s = state;
  for (let i = 0; i < n; i++) {
    s = reshuffleIfNeeded(s);
    const card = s.drawPile[s.drawPile.length - 1];
    if (!card) break;
    s = {
      ...s,
      drawPile: s.drawPile.slice(0, -1),
      players: s.players.map((p, idx) =>
        idx === playerIdx ? { ...p, hand: [...p.hand, card] } : p,
      ),
    };
  }
  return s;
}

function nextTurn(state: GameState, skip = 0): GameState {
  const n = state.players.length;
  const step = state.direction * (1 + skip);
  let next = (state.turn + step) % n;
  if (next < 0) next += n;
  return { ...state, turn: next, drewThisTurn: false };
}

function log(state: GameState, entry: string): GameState {
  return { ...state, log: [entry, ...state.log].slice(0, LOG_LIMIT) };
}

export function initGame(): GameState {
  const drawPile = shuffle(createDeck());
  const you: Player = { id: "you", name: "You", hand: [], isBot: false };
  const bot: Player = { id: "bot", name: "Bot", hand: [], isBot: true };
  const players = [you, bot];

  for (let i = 0; i < HAND_SIZE * players.length; i++) {
    players[i % players.length].hand.push(drawPile.pop()!);
  }

  // Ensure initial discard is a number card (skip effects on first turn)
  let starterIdx = drawPile.findIndex((c) => c.kind === "number");
  if (starterIdx === -1) starterIdx = drawPile.length - 1;
  const starter = drawPile.splice(starterIdx, 1)[0];
  const currentColor = starter.kind === "wild" ? "red" : starter.color;

  return {
    players,
    turn: 0,
    direction: 1,
    drawPile,
    discardPile: [starter],
    currentColor,
    pendingDraw: 0,
    drewThisTurn: false,
    winner: null,
    log: ["Game started."],
  };
}

export function reducer(state: GameState, action: Action): GameState {
  if (state.winner && action.type !== "RESTART") return state;

  switch (action.type) {
    case "RESTART":
      return initGame();

    case "PLAY": {
      const idx = state.turn;
      const player = state.players[idx];
      const card = player.hand.find((c) => c.id === action.cardId);
      if (!card) return state;
      if (!isPlayable(card, state)) return state;
      if (card.kind === "wild" && !action.chosenColor) return state;

      let s: GameState = {
        ...state,
        players: state.players.map((p, i) =>
          i === idx ? { ...p, hand: p.hand.filter((c) => c.id !== card.id) } : p,
        ),
        discardPile: [...state.discardPile, card],
        currentColor: card.kind === "wild" ? action.chosenColor! : card.color,
        drewThisTurn: false,
      };

      const label =
        card.kind === "wild" && action.chosenColor
          ? `${labelForCard(card)} → ${action.chosenColor}`
          : labelForCard(card);
      s = log(s, `${player.name} played ${label}`);

      if (s.players[idx].hand.length === 0) {
        s = { ...s, winner: player.id };
        return log(s, `${player.name} won!`);
      }

      if (card.kind === "action") {
        if (card.value === "draw2") {
          s = { ...s, pendingDraw: s.pendingDraw + 2 };
          s = nextTurn(s);
        } else if (card.value === "skip") {
          s = nextTurn(s, 1);
        } else if (card.value === "reverse") {
          if (s.players.length === 2) {
            s = nextTurn(s, 1);
          } else {
            s = { ...s, direction: (s.direction * -1) as 1 | -1 };
            s = nextTurn(s);
          }
        }
      } else if (card.kind === "wild") {
        if (card.value === "wild4") {
          s = { ...s, pendingDraw: s.pendingDraw + 4 };
        }
        s = nextTurn(s);
      } else {
        s = nextTurn(s);
      }
      return s;
    }

    case "DRAW": {
      const idx = state.turn;
      const player = state.players[idx];

      if (state.pendingDraw > 0) {
        let s = drawN(state, idx, state.pendingDraw);
        s = log(s, `${player.name} drew ${state.pendingDraw} cards`);
        s = { ...s, pendingDraw: 0 };
        return nextTurn(s);
      }

      if (state.drewThisTurn) return state;

      let s = drawN(state, idx, 1);
      const drawn = s.players[idx].hand[s.players[idx].hand.length - 1];
      s = log(s, `${player.name} drew a card`);

      if (isPlayable(drawn, s)) {
        return { ...s, drewThisTurn: true };
      }
      return nextTurn(s);
    }

    case "PASS": {
      if (!state.drewThisTurn) return state;
      const player = state.players[state.turn];
      const s = log(state, `${player.name} passed`);
      return nextTurn(s);
    }
  }
}
