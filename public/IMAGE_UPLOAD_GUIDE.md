# Where to Upload Your Real Images

All images live in the `public/` folder. Any image that's missing automatically
falls back to your VV placeholder (`placeholder.jpg`), so nothing ever breaks.

## 1. Product images (per product card)

Each product has its own folder named by its **product ID**. Put up to **6 images**
in each folder, named `1.jpg`, `2.jpg` ... `6.jpg`. The first image (`1.jpg`) is
the main card image; all of them slide automatically on the product page.

```
public/products/<product-id>/1.jpg
public/products/<product-id>/2.jpg
...
public/products/<product-id>/6.jpg
```

### Product IDs (which folder is which)

| Category   | Product                          | ID    | Folder                     |
|------------|----------------------------------|-------|----------------------------|
| Suits      | Maroon Embroidered Anarkali Suit | s1    | public/products/s1/        |
| Suits      | Cream Cotton Straight Suit       | s2    | public/products/s2/        |
| Kurtas     | Gold Foil Print A-Line Kurta     | k1    | public/products/k1/        |
| Kurtas     | Floral Printed Straight Kurta    | k2    | public/products/k2/        |
| **Sarees** | **Maroon Banarasi Silk Saree**   | sa1   | **public/products/sa1/**   |
| **Sarees** | **Pastel Chiffon Printed Saree** | sa2   | **public/products/sa2/**   |
| Lehengas   | Bridal Embroidered Lehenga       | l1    | public/products/l1/        |
| Lehengas   | Sequined Party-Wear Lehenga      | l2    | public/products/l2/        |
| Bottoms    | Solid Palazzo Pants              | b1    | public/products/b1/        |
| Bottoms    | Stretch Churidar Leggings        | b2    | public/products/b2/        |
| Dresses    | Indo-Western Printed Maxi Dress  | d1    | public/products/d1/        |
| Plus Size  | Extra Love Anarkali Kurta        | p1    | public/products/p1/        |
| Kids       | Kids Festive Lehenga Set         | kid1  | public/products/kid1/      |

**Example — to add real saree images:** drop your photos into
`public/products/sa1/` named `1.jpg`, `2.jpg`, ... `6.jpg`.

## 2. Category banner images (Shop by Category grid)

```
public/categories/<slug>.jpg
```
Slugs: `suits`, `kurtas`, `sarees`, `lehengas`, `bottoms`, `dresses`,
`plus-size`, `kids`.
Example: `public/categories/sarees.jpg`

## 3. Homepage hero image

```
public/hero.jpg
```

## 4. Brand images (already added)

- `public/logo.jpg` — main logo (header + footer)
- `public/placeholder.jpg` — VV fallback + card watermark

## Notes

- Use `.jpg` files. Portrait ~3:4 ratio (e.g. 600×800) looks best for products.
- After adding images you don't need to touch any code — just refresh the page
  in `npm run dev`. (If you built for production with `npm run build`, rebuild.)
- To add MORE products, edit `src/data/products.ts` and give each a unique `id`,
  then create a matching `public/products/<id>/` folder.
