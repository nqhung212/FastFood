//src/utils/ImportImage.js
// Helper to import images from assets/images because Vite doesn't support dynamic import of static files
export function importImages() {
  const images = import.meta.glob('../assets/images/*.{jpg,jpeg,png,webp}', {
    eager: true,
  });
  const formatted = {};
  for (const path in images) {
    const fileName = path.split('/').pop();
    formatted[fileName] = images[path].default || images[path];
  }

  return formatted;
}

const IMAGES = importImages()

export function getImage(src) {
  if (!src) return ''
  if (/^(https?:|data:)/.test(src)) return src
  const filename = src.split('/').pop()
  return IMAGES[filename] || src
}

export default getImage
