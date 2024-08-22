"use server"

export default async function imageLoader({ src, width, quality }) {
  return `/api/image?url=${encodeURIComponent(src)}&w=${width}&q=${quality || 75}`
}