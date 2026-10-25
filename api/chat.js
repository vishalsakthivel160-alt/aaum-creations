import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import fs from 'fs';
import path from 'path';

// Load .env.local first (local developer overrides), then .env
const envLocalPath = path.resolve(process.cwd(), '.env.local');
const envPath = path.resolve(process.cwd(), '.env');

let isEnvInitialized = false;
function ensureEnvLoaded() {
  if (isEnvInitialized) return;
  if (fs.existsSync(envLocalPath)) {
    dotenv.config({ path: envLocalPath });
  }
  if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath });
  }
  isEnvInitialized = true;
}

ensureEnvLoaded();

// In-memory rate limiting for serverless execution / dev server
// Tracks request timestamps per client IP
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute window
const MAX_REQUESTS_PER_WINDOW = 20; // 20 requests per minute per IP

function isRateLimited(clientIp) {
  const now = Date.now();
  const clientData = rateLimitMap.get(clientIp) || [];

  // Filter out timestamps outside the active window
  const activeTimestamps = clientData.filter((timestamp) => now - timestamp < RATE_LIMIT_WINDOW_MS);

  if (activeTimestamps.length >= MAX_REQUESTS_PER_WINDOW) {
    rateLimitMap.set(clientIp, activeTimestamps);
    return true;
  }

  activeTimestamps.push(now);
  rateLimitMap.set(clientIp, activeTimestamps);

  // Periodically clean up old entries in memory (prevent memory growth)
  if (rateLimitMap.size > 2000) {
    for (const [ip, stamps] of rateLimitMap.entries()) {
      const validStamps = stamps.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
      if (validStamps.length === 0) {
        rateLimitMap.delete(ip);
      } else {
        rateLimitMap.set(ip, validStamps);
      }
    }
  }

  return false;
}

// Load business knowledge directly
function getBusinessKnowledge() {
  try {
    const knowledgePath = path.resolve(process.cwd(), 'src/data/businessKnowledge.json');
    if (fs.existsSync(knowledgePath)) {
      const raw = fs.readFileSync(knowledgePath, 'utf8');
      return JSON.parse(raw);
    }
  } catch (err) {
    console.warn('Could not read businessKnowledge.json from disk, using fallback defaults', err.message);
  }

  return {
    business: {
      name: 'Aaum Creations',
      tagline: 'Pure Botanicals & Authentic Soursop Leaves',
      contact: {
        whatsappNumber: '+917094556516',
        displayPhone: '+91 70945 56516',
      },
    },
    products: [],
  };
}

function buildSystemInstructions(knowledge) {
  const business = knowledge.business || {};
  const products = knowledge.products || [];
  const guardrails = knowledge.strictGuardrails || [];
  const faqs = knowledge.frequentlyAskedQuestions || [];

  return `
You are the official customer support AI assistant for "${business.name}" (${business.tagline || ''}).
Your goal is to provide warm, courteous, accurate, and culturally respectful customer support in English and Tamil (தமிழ்).

=======================================================
CRITICAL BUSINESS GUARDRAILS (MUST STRICTLY FOLLOW):
=======================================================
1. MEDICAL & HEALTH CLAIMS:
   - You MUST NEVER make any unsupported medical, disease-treatment, or health-benefit claims about Soursop Leaves (e.g. NEVER claim it cures or treats cancer, tumors, diabetes, hypertension, or replaces any medicine).
   - Describe Soursop Leaves strictly and neutrally as traditional shadow-dried herbal leaves brewed for warm tea infusions.
   - Mention the traditional preparation (rinse 3-5 leaves, boil in 2-3 cups water for 10-15 mins) and advise consulting a doctor for any health or medical concerns.

2. ACCURACY & NO FABRICATION:
   - Do NOT invent or guess prices, discounts, delivery dates, shipping speeds, warehouse inventory levels, chemical ingredients, organic lab certifications, or return policies.
   - If a customer asks about live stock, exact discount codes, or bulk deals, state honestly that you do not have live warehouse/inventory details, and invite them to connect directly with the owner on WhatsApp (${business.contact?.displayPhone || 'via the WhatsApp button'}).

3. ORDERING PATHWAYS & DIRECT COURIER SERVICE:
   - When a customer asks how to buy, order, or purchase Soursop Leaves, ALWAYS clearly provide TWO ordering pathways:
     1. **Buy on Flipkart**: Secure online purchase via our official Flipkart store listing: https://dl.flipkart.com/s/dL!4cJuuuN
     2. **Direct Courier Order via WhatsApp**: Order directly by messaging us on WhatsApp (+91 70945 56516). The customer provides their delivery address and quantity, we share UPI/GPay payment details, and we courier the package directly to their doorstep across India!
   - NEVER fabricate banking or order tracking numbers. Real courier orders are finalized directly in the WhatsApp DM with the owner.

4. BILINGUAL SUPPORT (ENGLISH & TAMIL):
   - You fully understand Tamil (written in Tamil script or Tanglish).
   - If the customer addresses you in Tamil (e.g., "வணக்கம்", "சீத்தா இலை எப்படி வாங்கலாம்?", "Soursop leaves pathi sollu"), reply politely in Tamil or bilingual Tamil/English.
   - Always maintain a warm, welcoming tone (e.g. "வணக்கம்! Welcome to Aaum Creations").

=======================================================
STORE PRODUCT & DETAILS (EXCLUSIVE FOCUS):
=======================================================
${JSON.stringify(products, null, 2)}

=======================================================
BUSINESS FAQS:
=======================================================
${JSON.stringify(faqs, null, 2)}

=======================================================
CONTACT & WHATSAPP SUPPORT:
=======================================================
- Official WhatsApp Contact: ${business.contact?.whatsappNumber || 'Configure in .env.local'}
- Flipkart Verified Link for Soursop Leaves: https://dl.flipkart.com/s/dL!4cJuuuN
- Product Focus: We exclusively sell pure, authentic shadow-dried Soursop Leaves (Graviola / முள்சீத்தா இலைகள்).
- For bulk orders, custom queries, or direct assistance, direct the customer to inquire via WhatsApp.

Keep replies concise (2-4 brief paragraphs max), clear, helpful, and formatted with clean bullet points or clickable links where appropriate.
`.trim();
}

// Safely parse JSON body if not pre-parsed by runtime
async function parseRequestBody(req) {
  if (req.body && typeof req.body === 'object') {
    return req.body;
  }
  if (typeof req.body === 'string') {
    try {
      return JSON.parse(req.body);
    } catch {
      return null;
    }
  }

  // Handle stream body if needed
  return new Promise((resolve) => {
    let raw = '';
    req.on('data', (chunk) => {
      raw += chunk;
      // Protection against massive payload DOS attack
      if (raw.length > 50000) {
        resolve(null);
      }
    });
    req.on('end', () => {
      try {
        resolve(JSON.parse(raw));
      } catch {
        resolve(null);
      }
    });
    req.on('error', () => resolve(null));
  });
}

export default async function handler(req, res) {
  // Standard CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({
      error: 'Method Not Allowed. Only POST requests are supported.',
      code: 'METHOD_NOT_ALLOWED',
    });
  }

  // 1. IP Rate Limiting
  const clientIp =
    req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
    req.headers['x-real-ip'] ||
    req.socket?.remoteAddress ||
    '127.0.0.1';

  if (isRateLimited(clientIp)) {
    return res.status(429).json({
      error: 'You have sent too many messages in a short period. Please wait a minute before trying again.',
      code: 'RATE_LIMIT_EXCEEDED',
    });
  }

  // 2. Validate GEMINI_API_KEY
  ensureEnvLoaded();
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.trim() === '' || apiKey.includes('your_gemini_api_key_here')) {
    return res.status(503).json({
      error: 'The AI service is awaiting configuration: GEMINI_API_KEY is not set in server environment variables.',
      code: 'MISSING_API_KEY',
      details: 'Please set GEMINI_API_KEY in your .env.local file or Vercel Project Settings.',
    });
  }

  // 3. Body & Message Validation
  const body = await parseRequestBody(req);
  if (!body || !Array.isArray(body.messages) || body.messages.length === 0) {
    return res.status(400).json({
      error: 'Invalid request body. Expected a JSON object with a non-empty "messages" array.',
      code: 'INVALID_REQUEST',
    });
  }

  // Sanitize and validate messages
  // - Enforce role to be 'user' or 'assistant'
  // - Enforce string content
  // - Limit each user message to 500 characters
  // - Keep only the most recent 10 messages for conversation context
  const MAX_MESSAGE_LENGTH = 500;
  const MAX_HISTORY_COUNT = 10;

  const validMessages = [];
  const rawHistory = body.messages.slice(-MAX_HISTORY_COUNT);

  for (const msg of rawHistory) {
    if (!msg || typeof msg !== 'object') continue;
    const role = msg.role === 'assistant' ? 'assistant' : msg.role === 'user' ? 'user' : null;
    if (!role) continue;

    const rawContent = typeof msg.content === 'string' ? msg.content.trim() : '';
    if (!rawContent) continue;

    const safeContent = rawContent.slice(0, MAX_MESSAGE_LENGTH);
    validMessages.push({
      role,
      content: safeContent,
    });
  }

  if (validMessages.length === 0 || validMessages[validMessages.length - 1].role !== 'user') {
    return res.status(400).json({
      error: 'The last message in the conversation must be from the user with valid content.',
      code: 'INVALID_MESSAGES',
    });
  }

  // 4. Construct System Instructions & GoogleGenAI Client
  const knowledge = getBusinessKnowledge();
  const instructions = buildSystemInstructions(knowledge);
  const modelName = process.env.GEMINI_MODEL || 'gemini-3-flash-preview';

  const ai = new GoogleGenAI({ apiKey });

  try {
    // 5. Format contents for the Gemini API
    // Gemini multi-turn expects 'user' and 'model' roles
    const contents = validMessages.map((msg) => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }],
    }));

    // 6. Call the official @google/genai SDK
    const response = await ai.models.generateContent({
      model: modelName,
      contents: contents,
      config: {
        systemInstruction: instructions,
        maxOutputTokens: 700,
        temperature: 0.5,
      },
    });

    let replyText = response?.text || '';

    if (!replyText || replyText.trim() === '') {
      replyText = 'Thank you for contacting Aaum Creations. For immediate assistance with our Soursop Leaves, please reach out directly on WhatsApp at +91 70945 56516.';
    }

    // Return successful response
    return res.status(200).json({
      reply: replyText.trim(),
      model: modelName,
      provider: 'google-gemini',
      created: Date.now(),
    });
  } catch (apiError) {
    console.error('Google Gemini API Request failed:', apiError);

    // Map Gemini / HTTP error codes to safe user-friendly responses
    const status = apiError.status || 500;
    let safeMessage = 'Our AI customer support is momentarily unavailable. Please message our team on WhatsApp for prompt assistance.';
    let errorCode = 'AI_PROVIDER_ERROR';

    const errMsg = String(apiError.message || '');

    if (status === 400 || errMsg.includes('API_KEY_INVALID') || errMsg.includes('invalid API key')) {
      safeMessage = 'Gemini authentication error. The server API key is invalid or expired. Please check your GEMINI_API_KEY.';
      errorCode = 'INVALID_API_KEY';
    } else if (status === 429 || errMsg.includes('RESOURCE_EXHAUSTED') || errMsg.includes('quota')) {
      safeMessage = 'Gemini rate limit or quota exceeded. Please check your Google AI Studio project quota or try again in a moment.';
      errorCode = 'QUOTA_EXCEEDED';
    } else if (errMsg.includes('not found') || errMsg.includes('is not supported')) {
      safeMessage = `The configured Gemini model "${modelName}" is not available for this project. Please check GEMINI_MODEL in your settings.`;
      errorCode = 'MODEL_NOT_FOUND';
    }

    return res.status(status >= 400 && status < 600 ? status : 500).json({
      error: safeMessage,
      code: errorCode,
      details: process.env.NODE_ENV === 'development' ? errMsg : undefined,
    });
  }
}
