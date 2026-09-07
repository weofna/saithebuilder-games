export type Project = {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  file: string;
  fileName: string;
  fileSize: string;
  platform: string;
  accent: string;
};

export const projects: Project[] = [
  {
    slug: "roblox",
    name: "Roblox",
    tagline: "The ultimate online sandbox",
    description:
      "Join millions of players in user-generated worlds. Build, explore, and play with friends across thousands of immersive experiences.",
    file: "https://firebasestorage.googleapis.com/v0/b/games1-c664b.firebasestorage.app/o/RobloxPlayerInstaller.exe?alt=media&token=2409a658-04b5-4f52-9111-0eb58839ec1e",
    fileName: "RobloxPlayerInstaller.exe",
    fileSize: "9.7 MB",
    platform: "Windows",
    accent: "from-red-500/20 to-red-500/0",
  },
  {
    slug: "geometry-dash",
    name: "Geometry Dash",
    tagline: "Rhythm-based platforming, perfected",
    description:
      "Jump, fly, and flip your way through dangerous passages and spiky obstacles to the beat of pulse-pounding music.",
    file: "https://firebasestorage.googleapis.com/v0/b/games1-c664b.firebasestorage.app/o/GeometryDash-2.11.zip?alt=media&token=c5aa0733-0035-4620-9932-a7a701de119f",
    fileName: "GeometryDash-2.11.zip",
    fileSize: "199 MB",
    platform: "Windows",
    accent: "from-cyan-500/20 to-cyan-500/0",
  },
];

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}
