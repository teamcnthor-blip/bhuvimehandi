# 🌿 Bhuvi Mehandi — Luxury Bridal & Designer Henna Studio

A luxury bridal and designer mehndi artist website and interactive studio CMS built for high visual elegance, lightning-fast performance, and real-time cloud multi-device synchronization.

---

## 🌟 Key Features

- **Luxury Royal Rajasthani Aesthetic**: Rich crimson, royal gold accents, elegant typography (Playfair Display, Cormorant Garamond, Plus Jakarta Sans), and smooth animations.
- **Dynamic Studio CMS & Gallery**: Manage bridal collections, Arebic designs, rate cards, and services directly from the integrated Admin Portal (`/admin`).
- **Interactive Booking System**: Online appointment scheduling and bridal consultation forms with real-time status management.
- **4-Tier Zero-Data-Loss Architecture**:
  1. *Serverless Vercel API* (`/api/data`, `/api/inquiries`, `/api/config`)
  2. *Google Firebase Firestore* (Real-time live multi-device synchronization across all phones and laptops)
  3. *Client-side IndexedDB* (High-capacity disk storage for photos)
  4. *LocalStorage & Memory Cache* (Instant UI fast-path)
- **Zero Configuration Vercel Deployment**: Serverless API routes in `api/`, clean URLs (`/admin`), and optimized security & caching headers.

---

## 🚀 Deploying to Vercel (Step-by-Step)

### Option 1: Deploy via GitHub (Recommended — Auto-deploys every commit)

1. **Push this repository to your GitHub account**:
   ```bash
   git remote add origin https://github.com/<YOUR-USERNAME>/<YOUR-REPO-NAME>.git
   git branch -M main
   git push -u origin main
   ```
2. Open **[vercel.com](https://vercel.com)** and sign in with your GitHub account.
3. Click **"Add New Project"** &rarr; **"Continue with GitHub"**.
4. Select your `bhuvimehandi` repository from the list.
5. In the configuration screen:
   - **Framework Preset**: Leave as *Other* (or auto-detected).
   - **Root Directory**: `./` (default).
   - **Build Command**: Leave as default (`npm run build`).
   - **Output Directory**: Leave empty / default.
6. Click **"Deploy"**.
7. In ~30 seconds, your site will be live worldwide with free SSL (e.g. `https://your-studio.vercel.app`)!

---

### Option 2: Deploy directly with Vercel CLI

1. Open your terminal in this project folder.
2. Run:
   ```bash
   npx vercel
   ```
3. Follow the quick terminal prompts:
   - *Set up and deploy?* &rarr; `Y`
   - *Which scope?* &rarr; Select your account
   - *Link to existing project?* &rarr; `N`
   - *Project name?* &rarr; `bhuvi-mehandi-studio`
   - *Directory located?* &rarr; `./`
4. For production deployment, run:
   ```bash
   npx vercel --prod
   ```

---

## 👑 Accessing the Admin Portal

Once deployed, access your admin dashboard at:
- **Live URL**: `https://<your-project>.vercel.app/admin` (or `/admin.html`)
- **Default Credentials**:
  - **Username**: `admin`
  - **Password**: `admin123`
*(You can update password anytime in Settings inside the Admin Portal)*

---

## ☁️ Setting Up Cloud Sync (Firebase Firestore)

For public visitors and multi-device synchronization:
1. Follow the step-by-step instructions in [PUBLISHING_DATABASE_GUIDE.md](file:///PUBLISHING_DATABASE_GUIDE.md).
2. Create a free Firebase project at [console.firebase.google.com](https://console.firebase.google.com).
3. Create a **Firestore Database** in test mode.
4. Copy your web credentials (`apiKey`, `projectId`, `authDomain`, etc.).
5. In your Admin Portal (`/admin`), go to **☁️ Cloud Database** tab, paste the keys, and click **Save & Connect**.
6. All gallery photos, prices, and booking inquiries will instantly sync across every device in real time!

---

## 💻 Local Development

To run the full standalone Node.js server on your local machine:
```bash
npm start
```
- Website: `http://localhost:5502`
- Admin: `http://localhost:5502/admin.html`
