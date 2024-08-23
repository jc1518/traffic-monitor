export default function imageLoader(
  src: string,
  width: number,
  quality?: number
): string {
  return `/api/image?url=${encodeURIComponent(src)}&w=${width}&q=${
    quality || 75
  }`;
}
