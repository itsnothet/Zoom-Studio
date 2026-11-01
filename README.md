# Zoom Digital Photo Studio – website + photo backend

- `public/index.html` – the website (loads photos from `/api/photos`, falls back to the built-in samples)
- `public/admin.html` – upload page at `/admin.html` (password protected)
- `api/` – Vercel serverless functions; photos are stored in **Vercel Blob**

Every photo is resized/compressed in the browser (max 1600 px, ~1.5 MB) before upload, and the site shows every
photo inside fixed-shape frames (`object-fit: cover`), so a huge or odd-shaped photo can't break the layout.

## Deploy
1. Create a GitHub repo and push:
   ```
   git init && git add . && git commit -m "Zoom studio site"
   git branch -M main
   git remote add origin https://github.com/<you>/zoom-studio.git
   git push -u origin main
   ```
   (or: `gh repo create zoom-studio --public --source=. --push`)
2. vercel.com → **Add New → Project** → import the repo → Deploy (no build settings needed).
3. In the project: **Storage → Create Database → Blob** → connect it to the project (adds `BLOB_READ_WRITE_TOKEN`).
4. **Settings → Environment Variables** → add `ADMIN_PASSWORD` (your own strong password).
5. **Deployments → ⋯ → Redeploy** so the variables take effect.
6. Open `https://<your-site>.vercel.app/admin.html`, log in, upload photos.

Slots: Background, Logo, 8 Gallery photos, and 8 photos for each catalogue page. Empty slots keep the default sample.
