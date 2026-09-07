import type { Metadata } from "next";
import { FriendsClient } from "@/components/friends/friends-client";

export const metadata: Metadata = {
  title: "Friends — Games",
  description: "Your friends on Games.",
};

export default function FriendsPage() {
  return <FriendsClient />;
}
