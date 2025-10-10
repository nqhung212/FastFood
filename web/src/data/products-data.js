// src/data/products-data.js
import { importImages } from "../utils/ImportImage.js";

const allImages = importImages();
export const productsData = [
  {
    id: 1,
    name: "Burger Bò Phô Mai 1",
    slug: "burger-bo-pho-mai-1",
    description: "Bánh burger bò nướng kèm phô mai tan chảy.",
    price: 65000,
    categories: "Burger",
    image: allImages["7-2-1-number-png.png"],
  },
  {
    id: 4,
    name: "Burger Bò Phô Mai 4",
    slug: "burger-bo-pho-mai-4",
    description: "Bánh burger bò nướng kèm phô mai tan chảy.",
    price: 65000,
    categories: "Burger",
    image: allImages["1-2-4-number-png.png"],
  },
  {
    id: 5,
    name: "Burger Bò Phô Mai 5",
    slug: "burger-bo-pho-mai-5",
    description: "Bánh burger bò nướng kèm phô mai tan chảy.",
    price: 65000,
    categories: "Burger",
    image: allImages["11-2-5-number-png.png"],
  },
  {
    id: 2,
    name: "Gà Rán Giòn Cay 2",
    slug: "ga-ran-gion-cay-2",
    description: "Miếng gà rán giòn rụm, hương vị cay nồng.",
    price: 55000,
    categories: "Chicken",
    image: allImages["2-2-2-number-png.png"],
  },
  {
    id: 6,
    name: "Gà Rán Giòn Cay 6",
    slug: "ga-ran-gion-cay-6",
    description: "Miếng gà rán giòn rụm, hương vị cay nồng.",
    price: 55000,
    categories: "Chicken",
    image: allImages["8-2-6-number-png.png"],
  },
  {
    id: 3,
    name: "Khoai Tây Chiên 3",
    slug: "khoai-tay-chien-3",
    description: "Khoai tây chiên vàng ruộm, giòn tan.",
    price: 35000,
    categories: "Fries",
    image: allImages["5-2-3-number-png.png"],
  },
];
