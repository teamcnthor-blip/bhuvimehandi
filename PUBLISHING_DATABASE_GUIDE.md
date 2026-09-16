# 🌿 Bhuvi Mehandi — Permanent Database & Publishing Guide
### *Zero Data Loss Architecture: Real-time Cloud Sync across all Devices*

---

## 🌟 Why This Database Setup is Essential

When your website was running solely on your local computer, data was stored in your single browser's `localStorage` and `IndexedDB`. 

Once you publish your website to the public internet:
1. **Visitors' Devices**: Brides visiting from their smartphones will submit booking inquiries. Without a cloud database, those inquiries would get trapped in *their* phones. With **BhuviDB (Firebase Firestore)**, their inquiries are sent to the Cloud Database and **instantly appear on your Admin Dashboard**.
2. **Your Admin Updates**: When you upload new bridal photos, change prices, or edit your phone number in `admin.html`, they save directly to the Cloud Database. **Every visitor across the world immediately sees your updated designs and prices.**
3. **Can't Lose Guarantee**: Even if you clear browser history, change laptops, or switch phones, all your gallery photos and client booking inquiries remain safe in your cloud database forever.

---

## 🚀 Part 1: Setting Up Your Free Cloud Database (2 Minutes)

Google Firebase provides a **100% Free Forever Tier** (50,000 reads/day, 20,000 writes/day, 1GB data storage — no credit card needed).

### Step 1: Create a Free Firebase Project
1. Open [console.firebase.google.com](https://console.firebase.google.com) in your browser.
2. Sign in with your Google account.
3. Click **"Add project"** (or "Create a project").
4. Enter project name (e.g. `bhuvi-mehandi-studio`).
5. (Optional) Google Analytics can be left enabled or disabled, then click **"Create project"**.

### Step 2: Create Firestore Cloud Database
1. In your Firebase dashboard, click **"Build"** &rarr; **"Firestore Database"** in the left sidebar.
2. Click **"Create database"**.
3. Select your database location (choose `asia-south1 (Mumbai)` if you are in India, or your nearest location).
4. When prompted for Security Rules, choose **"Start in test mode"**, or go to the **"Rules"** tab and paste:
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /{document=**} {
         allow read, write: if true;
       }
     }
   }
   ```
5. Click **"Publish"** to save rules.

### Step 3: Get Your Web App Credentials
1. In Firebase Console, click the Gear icon ⚙️ (**Project settings**) at top-left.
2. Scroll down to **"Your apps"** and click the **Web icon (`</>`)**.
3. Enter App nickname (e.g. `Bhuvi Website`) and click **"Register app"**.
4. You will see a `firebaseConfig` snippet that looks like this:
   ```javascript
   const firebaseConfig = {
     apiKey: "AIzaSyD-EXAMPLE-KEY-HERE",
     authDomain: "bhuvi-mehandi-studio.firebaseapp.com",
     projectId: "bhuvi-mehandi-studio",
     storageBucket: "bhuvi-mehandi-studio.appspot.com",
     messagingSenderId: "123456789012",
     appId: "1:123456789012:web:abcdef123456"
   };
   ```

### Step 4: Connect to Your Admin Portal
1. Open your `admin.html` page in your browser.
2. Log into the Admin Dashboard (default: `admin` / `admin123`).
3. Click the **"☁️ Cloud Database"** tab in the left navigation sidebar.
4. Paste your `apiKey`, `projectId`, `authDomain`, `storageBucket`, `messagingSenderId`, and `appId` into the form.
5. Click **"💾 Save & Connect Cloud Database"**.
6. When prompted: *"Would you like to upload your existing local gallery photos and settings to your new Cloud Database now?"*, click **OK**.
7. Your status badge will turn **🟢 Online (Connected)**!

---

## 🌐 Part 2: How to Publish Your Website Online (Free)

You can publish this static website to any of the following world-class free hosting platforms:

### Option A: Netlify (Easiest — 60 Seconds)
1. Go to [netlify.com](https://www.netlify.com) and sign up for free.
2. Go to the **Sites** tab and look for **"Want to deploy a new site without connecting to Git? Drag and drop your site folder here"**.
3. Drag and drop your entire website folder into Netlify.
4. Netlify will give you a free live SSL URL (e.g. `https://bhuvi-mehandi.netlify.app`).
5. You can connect your custom domain (e.g. `bhuvimehandi.com`) anytime with 1 click.

### Option B: Vercel
1. Go to [vercel.com](https://vercel.com) and sign up for free.
2. Click **"Add New Project"** &rarr; Upload folder or link to your GitHub repository.
3. Click **"Deploy"**.

### Option C: GitHub Pages (100% Free)
1. Push this folder to a GitHub repository (e.g. `bhuvimehandi`).
2. Go to **Settings** &rarr; **Pages**.
3. Under **Source**, select `main` branch and `/ (root)` folder &rarr; click **Save**.
4. Your site is live at `https://<your-username>.github.io/<repo-name>/`.

### Option D: Traditional Hosting (Hostinger / cPanel / GoDaddy)
1. Log into your hosting cPanel or File Manager.
2. Open the `public_html` directory.
3. Upload all files from this folder (`index.html`, `admin.html`, `style.css`, `admin.css`, `script.js`, `admin.js`, `db-sync.js`, `hero-banner.png`).
4. Your website is immediately live on your domain.

---

## 💻 Part 3: Optional Local / VPS Node.js Server

If you prefer running a Node.js server on your own computer or VPS (Render, Railway, DigitalOcean):

1. Open PowerShell or Terminal in this folder.
2. Run:
   ```bash
   node server.js
   # or
   npm start
   ```
3. Open your browser to:
   - **Website**: `http://localhost:3000`
   - **Admin Portal**: `http://localhost:3000/admin.html`
4. The server automatically stores all inquiries and content permanently in:
   - `data_store.json`
   - `inquiries_store.json`

---

## 🛡️ Part 4: The Triple-Layer "Can't Lose" Guarantee

Your studio system now operates with **Triple Redundancy**:

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Layer 1** | **Google Firebase Firestore (Cloud)** | Global permanent storage. Inquiries and photos sync between clients and admin in real-time. |
| **Layer 2** | **IndexedDB (Local Disk)** | High-capacity device storage (hundreds of MBs) for offline fallback and fast loading. |
| **Layer 3** | **LocalStorage & Memory Cache** | Ultra-fast synchronous access for instant page render with zero delay. |
| **Emergency** | **JSON Auto-Snapshots & Download** | Creates timestamped local backups. Click *"Download Backup (JSON)"* anytime in Settings to keep a physical copy on your computer. |

### Offline Queueing
If your internet disconnects while a client submits a booking, or while you are editing designs:
- The system safely saves the data in the **Offline Queue**.
- As soon as your internet reconnects, `db-sync.js` automatically flushes and uploads all queued inquiries and edits to the cloud.

---

## 📞 Support & Verification
- **Test Booking**: Open `index.html`, submit a test inquiry, and verify it appears in `admin.html` under **"📋 Booking Inquiries"**.
- **Test Gallery Edit**: Add a new photo in `admin.html`, and verify it immediately displays on `index.html`.
