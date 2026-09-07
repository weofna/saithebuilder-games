import type { Metadata } from "next";
import { ProfileClient } from "@/components/profile/profile-client";

export const metadata: Metadata = {
  title: "Profile — Games",
  description: "Your Games profile.",
};

export default function ProfilePage() {
  return <ProfileClient />;
}
