//src/utils/ImportImage.js
//chỗ này là để import ảnh từ folder assets/images vì vite không hỗ trợ import động nên phải làm vậy
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
