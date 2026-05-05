export const AVATAR_COLORS = ['blue', 'red', 'green', 'gold', 'purple'] as const;

export type AvatarColor = (typeof AVATAR_COLORS)[number];

export function avatarColorFor(name: string): AvatarColor {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = (hash * 31 + name.charCodeAt(i)) | 0;
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length]!;
}
