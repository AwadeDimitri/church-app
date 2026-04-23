const YOUTUBE_ID_REGEX =
  /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;

type YouTubeQuality = 'default' | 'mq' | 'hq' | 'sd' | 'maxres';

export function getYouTubeId(url: string | null | undefined): string | null {
  if (!url) return null;
  return url.match(YOUTUBE_ID_REGEX)?.[1] ?? null;
}

export function getYouTubeThumbnail(
  url: string | null | undefined,
  quality: YouTubeQuality = 'mq',
): string | null {
  const id = getYouTubeId(url);
  if (!id) return null;
  const filename = quality === 'default' ? 'default' : `${quality}default`;
  return `https://img.youtube.com/vi/${id}/${filename}.jpg`;
}
