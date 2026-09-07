"use client";

import { useEffect, useReducer, useState } from "react";
import { RotateCcw } from "lucide-react";
import { CardView, ColorDot } from "@/components/uno/card";
import { chooseBotMove } from "@/lib/uno/bot";
import { initGame, reducer } from "@/lib/uno/game";
import { isPlayable, topCard } from "@/lib/uno/rules";
import type { Color } from "@/lib/uno/types";

const COLORS: Color[] = ["red", "yellow", "green", "blue"];
const COLOR_SWATCH: Record<Color, string> = {
  red: "bg-gradient-to-br from-red-500 to-red-600",
  yellow: "bg-gradient-to-br from-amber-400 to-amber-500",
  green: "bg-gradient-to-br from-emerald-500 to-emerald-600",
  blue: "bg-gradient-to-br from-blue-500 to-blue-600",
};

export function UnoGame() {
  const [mounted, setMounted] = useState(false);
  const [state, dispatch] = useReducer(reducer, undefined, initGame);
  const [wildPending, setWildPending] = useState<string | null>(null);

  useEffect(() => setMounted(true), []);

  const [you, bot] = state.players;
  const yourTurn = state.turn === 0 && !state.winner;
  const top = topCard(state);

  useEffect(() => {
    if (!mounted || state.winner) return;
    if (state.turn !== 1) return;
    const t = setTimeout(() => dispatch(chooseBotMove(state)), 850);
    return () => clearTimeout(t);
  }, [state, mounted]);

  if (!mounted) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-5xl items-center justify-center px-4">
        <p className="text-sm text-muted-foreground">Dealing cards…</p>
      </div>
    );
  }

  function attemptPlay(cardId: string) {
    if (!yourTurn) return;
    const card = you.hand.find((c) => c.id === cardId);
    if (!card || !isPlayable(card, state)) return;
    if (card.kind === "wild") {
      setWildPending(cardId);
    } else {
      dispatch({ type: "PLAY", cardId });
    }
  }

  const yourPlayable = new Set(
    you.hand.filter((c) => isPlayable(c, state)).map((c) => c.id),
  );
  const canDraw = yourTurn && !state.drewThisTurn;
  const mustDraw = yourTurn && state.pendingDraw > 0;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:py-12">
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            UNO
          </p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight sm:text-4xl">
            1v1 vs Bot
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            House rule: +2 and +4 stack.
          </p>
        </div>
        <button
          type="button"
          onClick={() => dispatch({ type: "RESTART" })}
          className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Restart
        </button>
      </div>

      {/* Bot area */}
      <PlayerBar
        name={bot.name}
        cardCount={bot.hand.length}
        active={state.turn === 1 && !state.winner}
      >
        <div className="flex flex-wrap gap-1">
          {bot.hand.map((c) => (
            <CardView key={c.id} card={c} faceDown small />
          ))}
        </div>
      </PlayerBar>

      {/* Center */}
      <div className="my-4 rounded-2xl border border-border bg-muted/30 p-6 sm:my-6 sm:p-10">
        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10">
          <div className="flex flex-col items-center gap-2">
            <button
              type="button"
              onClick={() => canDraw && dispatch({ type: "DRAW" })}
              disabled={!canDraw}
              aria-label="Draw a card"
              className={`transition-transform ${
                canDraw ? "cursor-pointer hover:-translate-y-1" : "opacity-60"
              }`}
            >
              <CardView faceDown />
            </button>
            <p className="text-xs text-muted-foreground">
              Draw · {state.drawPile.length}
            </p>
          </div>

          <div className="flex flex-col items-center gap-2">
            <CardView card={top} />
            <div className="flex items-center gap-1.5">
              <ColorDot color={state.currentColor} />
              <p className="text-xs uppercase tracking-wider text-muted-foreground">
                {state.currentColor}
              </p>
            </div>
          </div>

          {state.pendingDraw > 0 && (
            <div className="flex flex-col items-center gap-1 rounded-2xl border border-red-500/40 bg-red-500/10 px-5 py-3">
              <p className="text-xs uppercase tracking-wider text-red-400">
                Stack
              </p>
              <p className="text-3xl font-bold text-red-500">
                +{state.pendingDraw}
              </p>
              <p className="text-[10px] text-red-400/70">
                Stack or draw
              </p>
            </div>
          )}
        </div>
      </div>

      {/* You area */}
      <PlayerBar
        name={you.name}
        cardCount={you.hand.length}
        active={yourTurn}
        actions={
          <>
            {state.drewThisTurn && (
              <button
                type="button"
                onClick={() => dispatch({ type: "PASS" })}
                className="rounded-full bg-accent px-3.5 py-1.5 text-xs font-medium text-accent-foreground transition-transform hover:scale-105"
              >
                Pass
              </button>
            )}
            {mustDraw && (
              <button
                type="button"
                onClick={() => dispatch({ type: "DRAW" })}
                className="rounded-full bg-red-500 px-3.5 py-1.5 text-xs font-medium text-white transition-transform hover:scale-105"
              >
                Take +{state.pendingDraw}
              </button>
            )}
          </>
        }
      >
        <div className="flex min-h-24 flex-wrap justify-center gap-1.5 sm:min-h-28">
          {you.hand.map((c) => (
            <CardView
              key={c.id}
              card={c}
              playable={yourPlayable.has(c.id) && yourTurn}
              onClick={() => attemptPlay(c.id)}
            />
          ))}
        </div>
      </PlayerBar>

      {/* Log */}
      <div className="mt-6 space-y-1 text-xs">
        {state.log.slice(0, 5).map((entry, i) => (
          <p
            key={i}
            className={
              i === 0
                ? "text-foreground"
                : "text-muted-foreground/60"
            }
          >
            · {entry}
          </p>
        ))}
      </div>

      {/* Wild color picker */}
      {wildPending && (
        <Modal onClose={() => setWildPending(null)}>
          <h3 className="mb-1 text-lg font-semibold">Choose a color</h3>
          <p className="mb-6 text-sm text-muted-foreground">
            The next player must match this color.
          </p>
          <div className="grid grid-cols-2 gap-3">
            {COLORS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => {
                  dispatch({
                    type: "PLAY",
                    cardId: wildPending,
                    chosenColor: c,
                  });
                  setWildPending(null);
                }}
                className={`h-20 rounded-xl ${COLOR_SWATCH[c]} text-sm font-semibold uppercase tracking-wide text-white shadow-lg transition-transform hover:scale-[1.03]`}
              >
                {c}
              </button>
            ))}
          </div>
        </Modal>
      )}

      {/* Winner overlay */}
      {state.winner && (
        <Modal>
          <p className="text-xs uppercase tracking-wider text-muted-foreground">
            Game over
          </p>
          <h3 className="mt-2 text-4xl font-semibold tracking-tight">
            {state.winner === "you" ? "You win." : "Bot wins."}
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            {state.winner === "you"
              ? "Nicely played."
              : "Rough round. Rematch?"}
          </p>
          <button
            type="button"
            onClick={() => dispatch({ type: "RESTART" })}
            className="mt-6 inline-flex h-11 items-center justify-center rounded-full bg-accent px-6 text-sm font-medium text-accent-foreground transition-transform hover:scale-[1.02]"
          >
            Play again
          </button>
        </Modal>
      )}
    </div>
  );
}

function PlayerBar({
  name,
  cardCount,
  active,
  actions,
  children,
}: {
  name: string;
  cardCount: number;
  active: boolean;
  actions?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`rounded-2xl border p-4 transition-colors ${
        active
          ? "border-emerald-500/40 bg-emerald-500/[0.03]"
          : "border-border bg-card"
      }`}
    >
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span
            className={`h-2 w-2 rounded-full ${
              active
                ? "bg-emerald-500 shadow-[0_0_8px] shadow-emerald-500"
                : "bg-muted-foreground/40"
            }`}
          />
          <p className="text-sm font-medium">{name}</p>
          <p className="text-xs text-muted-foreground">· {cardCount} cards</p>
          {cardCount === 1 && (
            <span className="ml-1 rounded-full bg-red-500 px-2 py-0.5 text-[10px] font-bold text-white">
              UNO
            </span>
          )}
        </div>
        <div className="flex gap-2">{actions}</div>
      </div>
      {children}
    </div>
  );
}

function Modal({
  children,
  onClose,
}: {
  children: React.ReactNode;
  onClose?: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-fade-up"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-2xl border border-border bg-card p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}
