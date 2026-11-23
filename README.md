# Zivara Jewellery Shop

Complete responsive Node.js + Express + PostgreSQL jewellery storefront inspired by the uploaded Zivara design. One Vercel Node serverless function (`api/index.js`), static HTML/CSS/JS pages, customer portal, admin portal, and PDF invoice download on **both** customer and admin order pages. The supplied jewellery photos and burgundy/pink theme are retained.

## Requirements
Node.js 20+, PostgreSQL database (Neon free tier works), npm.

## Local setup
1. `npm install`
2. Copy `.env.example` to `.env`. Configure `DATABASE_URL`, long random `JWT_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`.
3. `npm run db:setup`
4. `npm run db:seed`
5. `npm run create-admin`
6. `npm run dev` — open `http://localhost:3000`

Admin: `/admin/login.html` with the credentials **you set in `.env`**. Customer: `/user/register.html`. Re-running seed does not duplicate named products.

## Hosting on Vercel free
1. Create a free Neon PostgreSQL database. Use its pooled PostgreSQL URL as `DATABASE_URL`.
2. Import this folder into a GitHub repository; push code but **never push `.env`**.
3. Import the repository into Vercel. Framework preset: **Other**; root directory: project root. The included `vercel.json` maps the API to the **single** `api/index.js` function.
4. Set production environment variables `DATABASE_URL`, `JWT_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD` in Vercel project settings. Redeploy after adding them.
5. Run the three setup commands on your computer against the same Neon DATABASE_URL to create schema, products, and admin. They are *not* HTTP endpoints.
6. Open the deployed site. Static pages/assets live at their original paths; `/api/*` goes to the one serverless Express handler.

## Features
- Customer register/login, profile, password update, collection/search/category filters, product details, stock-aware cart, checkout, orders and order details.
- COD or **manual UPI** selection (not an integrated payment gateway). Admin can mark payment Paid upon verifying receipt; marking Delivered changes payment status to Paid. Avoid claiming real transaction verification.
- Admin category/product create/edit/deactivate, order/payment status management, user enable/disable, messages, metrics and sales reports.
- Genuine PDF download generated using PDFKit: customer can access **only their invoices**, administrator can download every order invoice. Order item names and prices are snapshotted at checkout.
- Product image paths can use included images or externally hosted HTTPS URLs. Serverless local filesystem uploads are deliberately not supported (use external image hosting for new photos).

## Security notes
Passwords use bcryptjs; JWT for access; SQL parameter binding; stock and order creation performed in a PostgreSQL transaction. Token is held in browser localStorage; consider HTTP-only cookies, CSRF strategy and a payment gateway before production with real customer money. Do not commit actual database or admin secrets.

## Important
Images referenced from the original uploaded ZIP are bundled. Live Neon/Vercel integrations require your own credentials and are not testable without them. No real UPI charge is initiated.
