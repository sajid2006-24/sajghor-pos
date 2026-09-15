# সাজঘর কসমেটিক্স এন্ড ভ্যারাইটিজ সেন্টার — POS

Production-quality POS for **মোঃ রায়হান মিয়া** (01799-303374), চর কাশিম নগর-নতুন মোড়ের পূর্ব পার্শ্বে, বেলাব, নরসিংদী।

## Run

```bash
npm install
npm run dev     # http://localhost:5173
npm run build   # production build
npm run preview # preview build
```

Default login: `admin` / `admin123` (local auth, stored in localStorage).

## Features
- ড্যাশবোর্ড (৳0 empty state, real calculations)
- নতুন বিক্রয় — product/service search, variants, cart discounts, cash/bKash/Nagad/Other, change calc, invoice INV-000001, print
- পণ্য — SKU/barcode, brand, stock, min stock, batch/expiry, variants (shoe sizes)
- স্টক — auto decrease on sale, increase on purchase/return, low-stock warnings
- ক্রয় — supplier, stock update
- সার্ভিস — per page/copy/item/fixed pricing
- বিক্রয় ইতিহাস — view/print/return
- রিপোর্ট — sales/profit/payment/category/product (from real data only)
- খরচ — manual entries
- সেটিংস — store profile, invoice, payment toggle, backup JSON

Data persists in localStorage (`sajghor_db_v1`) — survives refresh/logout/restart. No fake/demo data.

## Deploy
`dist/` after `npm run build` is static — deploy to Netlify/Vercel/any static host.
