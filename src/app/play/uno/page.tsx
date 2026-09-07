import type { Metadata } from "next";
import { UnoGame } from "@/components/uno/uno-game";

export const metadata: Metadata = {
  title: "UNO — Games",
  description: "Play UNO 1v1 against a bot in your browser.",
};

export default function UnoPage() {
  return <UnoGame />;
}
