# ReelForge AI 🎬

A production-ready AI-powered SaaS platform that generates complete viral short-form video scripts, scene breakdowns, hashtags, CTAs, and AI thumbnails for Instagram, YouTube Shorts, TikTok, LinkedIn, and Twitter/X.

## 🌐 Live Demo

**Frontend:** https://reelforge-ai-six.vercel.app
**Backend API:** https://reelforge-ai-bgh1.onrender.com

---

## 🎯 Demo Instructions

Follow these steps to evaluate the full application:

### Step 1 — Create an Account
1. Visit https://reelforge-ai-six.vercel.app
2. Click **Sign up free**
3. Enter your name, email, and password (min 6 characters)
4. Click **Create Account**
5. You will be redirected to the Login page

### Step 2 — Login
1. Enter the email and password you just created
2. Click **Sign In**
3. You will be redirected to your Dashboard

### Step 3 — Generate a Viral Reel Script
1. Click **New Reel** or **Generator** in the navbar
2. Fill in the form:
   - **Topic** — e.g. `5 morning habits that changed my life`
   - **Niche** — select from the dropdown e.g. `Self Improvement`
   - **Platform** — click a platform e.g. `Instagram`
   - **Style** — click a style e.g. `Motivational`
3. Click **Generate Viral Content**
4. Wait 15–30 seconds while AI generates your content

### Step 4 — View Generated Content
After generation you will see a full project page with:
- ✅ Viral video title
- ✅ Hook (first 3 seconds script)
- ✅ Full spoken script (150–200 words)
- ✅ Scene-by-scene breakdown
- ✅ Call to action
- ✅ 15 hashtags
- ✅ AI generated thumbnail image (powered by Pollinations AI)
- ✅ Viral score (1–100)

### Step 5 — Test All Features
- 📋 **Copy** any section using the Copy button
- ✏️ **Edit** the script using the Edit button
- 💾 **Save** your changes
- 📁 **Duplicate** the script
- 🗑️ **Delete** the script
- 📂 **Assign to a folder** using the folder dropdown

### Step 6 — Dashboard
1. Go back to Dashboard
2. See all your generated scripts as cards with thumbnails
3. Use the **Search** bar to filter scripts
4. Create a **New Folder** to organise scripts
5. View **Stats** — total scripts, average viral score, folders, this week

### Step 7 — Profile
1. Click **Profile** in the navbar
2. View your account details
3. Click **Sign Out** to logout

---

## 🚀 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Tailwind CSS, Framer Motion |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas |
| Auth | JWT (JSON Web Tokens), bcryptjs |
| AI Text | OpenRouter API (Meta LLaMA 3 8B) |
| AI Images | Pollinations AI (no API key required) |
| Deployment | Vercel (frontend), Render (backend) |

---

## ✨ Features

- 🔐 JWT authentication (signup, login, protected routes)
- 🤖 AI script generation using OpenRouter (3 grouped requests)
- 🖼️ AI thumbnail generation using Pollinations AI
- 📊 Viral score prediction (1–100)
- 📁 Folder organisation system
- ✏️ Edit and save generated scripts
- 📋 One-click copy for all sections
- 🔄 Duplicate scripts
- 🔍 Search and filter scripts
- 📱 Fully responsive dark UI with glassmorphism design

---

## 🛠️ Local Development

### Prerequisites
- Node.js 18+
- MongoDB Atlas account
- OpenRouter API key (free at openrouter.ai)

### Clone and Install
```bash
git clone https://github.com/thushanksachin10/reelforge-ai.git
cd reelforge-ai
```

### Backend Setup
```bash
cd backend
npm install
```

Create `backend/.env`:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
OPENROUTER_API_KEY=your_openrouter_api_key
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

```bash
npm start
```

### Frontend Setup
```bash
cd frontend
npm install
```

Create `frontend/.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

```bash
npm run dev
```

Visit `http://localhost:5173`

---

## 📁 Project Structure

reelforge-ai/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── scriptController.js
│   │   └── folderController.js
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Script.js
│   │   └── Folder.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── scriptRoutes.js
│   │   └── folderRoutes.js
│   ├── services/
│   │   └── geminiService.js
│   └── server.js
└── frontend/
└── src/
├── components/
│   ├── Navbar.jsx
│   ├── ScriptCard.jsx
│   ├── Loader.jsx
│   ├── CopyButton.jsx
│   └── ProtectedRoute.jsx
├── context/
│   └── AuthContext.jsx
├── pages/
│   ├── Login.jsx
│   ├── Signup.jsx
│   ├── Dashboard.jsx
│   ├── Generator.jsx
│   ├── ProjectDetail.jsx
│   └── Profile.jsx
└── services/
└── api.js

---

## 🤖 AI Architecture

AI thumbnail generation is implemented using prompt-based image synthesis architecture. The system generates a detailed visual prompt using LLaMA 3 and converts it into a real image URL via Pollinations AI — no image API key required.

Content generation uses 3 grouped AI requests instead of 8 separate calls for quota efficiency:
- **Group 1** — Title + Hook
- **Group 2** — Script + Scenes + CTA + Viral Score  
- **Group 3** — Hashtags + Thumbnail Prompt + Thumbnail Image

---

## 👨‍💻 Built With

- [OpenRouter](https://openrouter.ai) — Free LLM API
- [Pollinations AI](https://pollinations.ai) — Free AI image generation
- [MongoDB Atlas](https://mongodb.com/atlas) — Cloud database
- [Render](https://render.com) — Backend hosting
- [Vercel](https://vercel.com) — Frontend hosting
