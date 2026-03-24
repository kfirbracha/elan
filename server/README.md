# Contact API (SMTP)

Sends the site contact form to **info@7factors.co** using your SMTP server.

## Setup

1. Install dependencies: `npm install`
2. Copy env file: `cp .env.example .env`
3. Edit `.env` with your SMTP settings (host, port, user, pass, from address).

## Run

- **Start:** `npm start` (listens on port 3001)
- **Dev (auto-reload):** `npm run dev`

## Development with Angular

1. Start this server: `cd server && npm start`
2. Start Angular: `ng serve` (from project root). The dev server proxies `/api` to this server.

---

## Deploying on Hostinger (single Node app)

On Hostinger you run **one Node.js app** that serves both the Angular site and the contact API. No separate static hosting.

### 1. Build the site and prepare the server

From the **project root**:

```bash
# Build Angular (output goes to dist/...)
npm run build

# Copy the built site into the server (adjust path if your dist folder differs)
# Common: dist/titangate-clone/browser  or  dist/browser
cp -r dist/titangate-clone/browser server/public
# If that path doesn't exist, try:  cp -r dist server/public
```

### 2. Set environment variables on Hostinger

In the Hostinger panel for your Node.js app, set:

- `NODE_ENV=production`
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` (your SMTP server)
- `SMTP_FROM` (e.g. `"7 Factors Contact <noreply@7factors.co>"`)
- `CONTACT_TO=info@7factors.co`

### 3. Deploy the `server` folder

- Upload the **contents** of the `server/` folder (including `public/`, `package.json`, `index.js`, etc.) via Hostinger’s Node.js app (e.g. GitHub connect or upload).
- Or connect a repo and set the **root** to the `server` folder if Hostinger allows a monorepo subfolder.
- Start command: `npm start` or `node index.js`.

### 4. How it works in production

When `NODE_ENV=production`:

- `POST /api/contact` → sends email via your SMTP.
- All other requests → served from `server/public` (your Angular build). Client-side routes get `index.html`.

So the same URL (e.g. your domain) serves the site and the contact form; the form posts to `/api/contact` with no extra proxy.
