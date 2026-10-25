# 🌿 Aaum Creations — AI Customer Support Chatbot

An elegant, beginner-friendly AI customer support chatbot and ecommerce storefront built for **Aaum Creations** (Pure Botanicals & Authentic Soursop Leaves).

Powered by **React + Vite**, a **Vercel-compatible Node.js serverless endpoint** (`api/chat.js`), and the official **Google Gemini API** (`@google/genai`).

---

## 📋 Features

- **Nature-Inspired Design**: Dark forest green (`#173d2b`), soothing sage, off-white cream background, and subtle earthy accents reflecting botanical purity.
- **Exclusive Soursop Focus**: 100% focused on authentic, shadow-dried Soursop Leaves (Graviola / முள்சீத்தா இலைகள்) with an interactive 4-image photo gallery and 3-step traditional tea brewing guide.
- **Floating Chat Trigger**: Accessible floating action button on the bottom-right with online status badge and smooth entrance animation.
- **Bilingual Intelligence**: Fully understands and communicates in **English** and **Tamil (தமிழ்)** (including Tanglish).
- **Strict Business Guardrails**:
  - **Zero Unsupported Medical Claims**: Strictly prohibits medical, cancer, or disease-treatment claims regarding Soursop Leaves. Describes them neutrally as traditional dried leaves for herbal tea infusions.
  - **Zero Fabricated Data**: Never hallucinates prices, live inventory, discounts, delivery dates, or certifications. Always connects customers to the owner on WhatsApp for custom inquiries.
  - **No Fake Order Confirmations**: Never claims an order or shipment has been processed unless a real integration exists.
- **Official Marketplace Links**: Provides the verified Flipkart listing for Soursop Leaves (`https://dl.flipkart.com/s/dL!4cJuuuN`).
- **Configurable WhatsApp Contact**: Direct 1-click WhatsApp buttons with pre-filled inquiries using a configurable business phone number.
- **Rich Interaction**: Welcome message, suggestion prompt chips, auto-scrolling message bubbles, typing dots indicator, error handling with retry, character count (max 500 chars), clear-chat control, and keyboard navigation (**Enter** to send, **Shift+Enter** for new line).
- **Security & Privacy**: API keys remain exclusively on the server (`api/chat.js`). No customer conversations or personal data are stored in third-party databases. In-memory IP rate limiting prevents abuse.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, JavaScript, Vite 8, Lucide React icons, Vanilla CSS Design System.
- **Backend**: Node.js Serverless Function compatible with Vercel (`api/chat.js`).
- **AI Engine**: Official Google Gen AI JavaScript SDK (`@google/genai`) using Gemini models (e.g. `gemini-3-flash-preview`).
- **Runtime**: Node.js 20+ (compatible with Node 20, 22, and 24).

---

## 🚀 Quick Start & Installation

### 1. Prerequisites
Ensure [Node.js](https://nodejs.org/) (v18 or higher) is installed:
```bash
node -v
npm -v
```

### 2. Install Dependencies
In the project directory, run:
```bash
npm install
```

### 3. Configure Environment Variables (.env.local)
Your secret keys should be placed in `.env.local` in the project root:
```env
# Server-side Google Gemini API Key (Never exposed to client)
# Get a free key at: https://aistudio.google.com/app/apikey
GEMINI_API_KEY=your_gemini_api_key_here

# Model configuration (e.g. gemini-3-flash-preview)
GEMINI_MODEL=gemini-3-flash-preview

# Business WhatsApp Phone Number (Country code + digits without '+')
VITE_WHATSAPP_PHONE_NUMBER=917094556516
```

> **Security Guarantee:** `.env.local` is listed in `.gitignore` and is never tracked by git or exposed to the browser.

---

## 💻 Local Development & Testing

### 1. Check Available Models & Test Connection
To verify your Gemini API key and discover which model IDs are active on your Google project **without guessing**:
```bash
npm run check:models
```

### 2. Run Backend Security & Rate Limiting Tests
To test input validation, rate limiting, and serverless error handling:
```bash
npm run test:api
```

### 3. Start the Local Development Server
```bash
npm run dev
```
Open **[http://localhost:5173/](http://localhost:5173/)** in your browser. Both the React storefront and the `/api/chat` backend run together seamlessly via the included Vite dev middleware!

### 4. Build for Production
```bash
npm run build
```

---

## 📂 Project Structure

```text
aaum-creations-chatbot/
├── api/
│   └── chat.js                   # Vercel-compatible serverless API endpoint (Google Gemini API)
├── knowledge/
│   ├── businessKnowledge.json    # Easy-to-edit product & business information for owner
│   └── README.md                 # Guide for updating business knowledge
├── public/
│   └── assets/                   # High-res authentic product photos (packaging box, shadow dried leaves, etc.)
├── scripts/
│   ├── check-models.js           # Live Google Gemini account model verifier
│   └── verify-api.js             # Automated test suite for backend endpoint & validation
├── src/
│   ├── components/
│   │   ├── ChatMessage.jsx       # Formatted chat bubble (Markdown & links)
│   │   ├── ChatWidget.jsx        # Floating modal chat window & controls
│   │   ├── QuickPrompts.jsx      # Suggested inquiry chips
│   │   ├── StoreShowcase.jsx     # Ecommerce landing page with interactive photo gallery
│   │   └── WhatsAppButton.jsx    # Configurable WhatsApp contact link
│   ├── data/
│   │   └── businessKnowledge.json# Synced knowledge base
│   ├── utils/
│   │   └── formatters.jsx        # Safe markdown parser for bold text & Flipkart links
│   ├── App.css                   # Complete design system & responsive styling
│   ├── App.jsx                   # Main React component
│   ├── index.css                 # Global tokens, reset, & accessibility styles
│   └── main.jsx                  # React application root
├── .env.example                  # Template for environment variables
├── .env.local                    # Local secret configuration (git-ignored)
├── .gitignore                    # Git ignore file excluding .env and secrets
├── package.json                  # Scripts & dependencies
├── vercel.json                   # Vercel deployment & routing configuration
├── vite.config.js                # Vite configuration with dev server middleware
└── README.md                     # This documentation
```

---

## ☁️ Deployment to Vercel

### Deploy via GitHub
1. Push your repository to GitHub (secrets in `.env.local` are automatically ignored).
2. In the Vercel dashboard, click **Add New Project** and import the repository.
3. Under **Environment Variables**, add:
   - `GEMINI_API_KEY` = your live Google Gemini API key
   - `GEMINI_MODEL` = `gemini-2.5-flash`
   - `VITE_WHATSAPP_PHONE_NUMBER` = `917094556516`
4. Click **Deploy**. Vercel will host the frontend and run `api/chat.js` as a global Serverless Function.

---

## 🔧 Troubleshooting

| Issue | Cause | Solution |
| :--- | :--- | :--- |
| **HTTP 503 `MISSING_API_KEY`** | `GEMINI_API_KEY` is not set in `.env.local` | Add your Gemini key to `.env.local` and restart the server. |
| **HTTP 400 `INVALID_API_KEY`** | The Gemini API key is incorrect or invalid | Verify or create a new API key at [aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey). |
| **HTTP 429 `QUOTA_EXCEEDED`** | Google AI Studio rate limit or quota exceeded | Wait a moment or check project quotas at [aistudio.google.com](https://aistudio.google.com/). |
| **HTTP 429 `RATE_LIMIT_EXCEEDED`** | More than 20 requests sent in 1 minute from one IP | Wait 60 seconds before sending another chat message. |

---

## 🌿 Business Integrity Statement

Aaum Creations customer support operates under strict botanical integrity:
- **No medical or health cure claims** are made for Soursop Leaves.
- **Pure Botanical Authenticity**: 100% authentic, shadow-dried Soursop Leaves (Graviola / முள்சீத்தா இலைகள்) packaged in protective Aaum Creations boxes.
- **Authentic marketplace integration**: Verified Flipkart link provided for Soursop Leaves (https://dl.flipkart.com/s/dL!4cJuuuN).
- **Owner fallback**: Instant transition to human WhatsApp support whenever customized inquiries arise.
