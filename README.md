# VastraVedh — Trending Meets Elegance

A women's Indian ethnic wear e-commerce website built with **Next.js 14**, **TypeScript**, and **Tailwind CSS**.

## Brand

- **Maroon** `#7B0F2B` — primary
- **Gold** `#C9A227` — accent
- **Cream** `#F7F2E7` — background

## Features

- Homepage with hero, category grid, bestsellers, promo banner, and new arrivals
- Category pages with filters (price, fabric, size) and sorting
- Product detail page with image gallery, color/size selection, and add-to-cart
- Shopping cart with quantity management, subtotal, and shipping logic (persisted to localStorage)
- Responsive, mobile-first layout
- Demo account/login page

> Product data is currently mock data in `src/data/`. Images use `picsum.photos` placeholders. Payments and real auth are planned for a later phase.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
src/
  app/                 # App Router pages
    page.tsx           # Homepage
    category/[slug]/   # Category listing
    product/[slug]/    # Product detail
    cart/              # Cart
    account/           # Login (demo)
  components/          # Header, Footer, ProductCard, filters, etc.
  context/             # CartContext (cart state + localStorage)
  data/                # Categories & products (mock)
  lib/                 # Formatting helpers
```

## Swapping in the Real Logo

Drop your logo image into `public/logo.png` and update `src/components/Logo.tsx` to use `next/image` instead of the text mark.

## Next Steps

- Connect a backend / CMS for real products
- Add authentication and user accounts
- Integrate a payment gateway (Razorpay / Stripe)
- Build the companion mobile app (React Native)
