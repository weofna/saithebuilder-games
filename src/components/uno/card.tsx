import type { Card, Color } from "@/lib/uno/types";

const COLOR_BG: Record<Color, string> = {
  red: "bg-gradient-to-br from-red-500 to-red-600",
  yellow: "bg-gradient-to-br from-amber-400 to-amber-500",
  green: "bg-gradient-to-br from-emerald-500 to-emerald-600",
  blue: "bg-gradient-to-br from-blue-500 to-blue-600",
};

const WILD_BG =
  "bg-[conic-gradient(from_0deg,theme(colors.red.500),theme(colors.amber.400),theme(colors.emerald.500),theme(colors.blue.500),theme(colors.red.500))]";

function symbolFor(card: Card): string {
  if (card.kind === "number") return String(card.value);
  if (card.kind === "action") {
    if (card.value === "skip") return "⊘";
    if (card.value === "reverse") return "↺";
    return "+2";
  }
  return card.value === "wild4" ? "+4" : "★";
}

type CardViewProps = {
  card?: Card;
  faceDown?: boolean;
  playable?: boolean;
  small?: boolean;
  onClick?: () => void;
};

export function CardView({ card, faceDown, playable, small, onClick }: CardViewProps) {
  const dims = small
    ? "h-14 w-10 text-xs"
    : "h-24 w-16 text-2xl sm:h-28 sm:w-20 sm:text-3xl";

  if (faceDown || !card) {
    return (
      <div
        className={`${dims} shrink-0 rounded-xl border border-white/10 bg-gradient-to-br from-neutral-800 via-neutral-900 to-black shadow-lg`}
        aria-hidden
      >
        <div className="m-1.5 flex h-[calc(100%-0.75rem)] items-center justify-center rounded-lg border border-white/5">
          <span className="rotate-[-20deg] font-black italic tracking-tighter text-white/20">
            UNO
          </span>
        </div>
      </div>
    );
  }

  const bg = card.kind === "wild" ? WILD_BG : COLOR_BG[card.color];
  const symbol = symbolFor(card);

  return (
    <button
      type="button"
      disabled={!playable}
      onClick={onClick}
      aria-label={
        card.kind === "wild"
          ? card.value === "wild4"
            ? "Wild draw 4"
            : "Wild"
          : `${card.color} ${card.kind === "number" ? card.value : card.value}`
      }
      className={`${dims} group relative shrink-0 rounded-xl ${bg} font-black text-white shadow-lg transition-all duration-150 ${
        playable
          ? "cursor-pointer ring-2 ring-white/40 hover:-translate-y-3 hover:shadow-2xl hover:shadow-black/50"
          : onClick && !small
            ? "opacity-70"
            : ""
      }`}
    >
      <span
        className="absolute inset-1 rounded-lg border border-white/25"
        aria-hidden
      />
      <span className="relative drop-shadow-md">{symbol}</span>
    </button>
  );
}

export function ColorDot({ color, className = "" }: { color: Color; className?: string }) {
  const map: Record<Color, string> = {
    red: "bg-red-500",
    yellow: "bg-amber-400",
    green: "bg-emerald-500",
    blue: "bg-blue-500",
  };
  return <span className={`inline-block h-3 w-3 rounded-full ${map[color]} ${className}`} />;
}
