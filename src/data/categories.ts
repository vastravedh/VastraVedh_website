import { Category } from "./types";
import { categoryPhoto } from "@/lib/productImages";

/**
 * Category banner images use real online photos. To use your own photo,
 * drop it at public/categories/<slug>.jpg and set image: "/categories/<slug>.jpg".
 */
const catImage = (slug: string, _name: string) => categoryPhoto(slug, 0);

export const categories: Category[] = [
  {
    slug: "suits",
    name: "Suits",
    description:
      "Well-coordinated ethnic sets with kurta, bottom and dupatta — from straight fits to Anarkalis and Angarkhas.",
    image: catImage("suits", "Suits"),
  },
  {
    slug: "kurtas",
    name: "Kurtas",
    description:
      "Designer kurtas in different lengths, cuts, prints and patterns to mix and match your look.",
    image: catImage("kurtas", "Kurtas"),
  },
  {
    slug: "sarees",
    name: "Sarees",
    description:
      "Eternal pieces of Indian fashion in the richest silk, cotton and chiffon fabrics.",
    image: catImage("sarees", "Sarees"),
  },
  {
    slug: "lehengas",
    name: "Lehengas",
    description:
      "Party-wear lehengas with delicate embroidery and gorgeous embellishment for festivals and weddings.",
    image: catImage("lehengas", "Lehengas"),
  },
  {
    slug: "bottoms",
    name: "Bottoms",
    description:
      "Salwar pants, high-waist trousers, churidars, palazzos and sharara pants in rich colours.",
    image: catImage("bottoms", "Bottoms"),
  },
  {
    slug: "dresses",
    name: "Dresses",
    description:
      "Western and ethnic dresses in eye-catching prints for a stylish Indo-western look.",
    image: catImage("dresses", "Dresses"),
  },
  {
    slug: "plus-size",
    name: "Plus Size",
    description:
      "Extra Love by VastraVedh — signature designs available from 3XL to 6XL.",
    image: catImage("plus-size", "Plus Size"),
  },
  {
    slug: "kids",
    name: "Kids",
    description:
      "Adorable suits, lehengas and dresses for little ones from 3 to 12 years.",
    image: catImage("kids", "Kids"),
  },
];

export function getCategory(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}
