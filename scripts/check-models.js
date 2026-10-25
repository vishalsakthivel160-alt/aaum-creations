import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

// 1. Load .env.local first, then .env
const envLocalPath = path.resolve(process.cwd(), '.env.local');
const envPath = path.resolve(process.cwd(), '.env');

if (fs.existsSync(envLocalPath)) {
  dotenv.config({ path: envLocalPath });
}
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
}

console.log('====================================================');
console.log('🌿 Aaum Creations — Google Gemini Model Verifier');
console.log('====================================================\n');

const apiKey = process.env.GEMINI_API_KEY;

// Check if key is configured
if (!apiKey || apiKey.trim() === '' || apiKey.includes('your_gemini_api_key_here')) {
  console.log('⚠️  GEMINI_API_KEY is not configured yet in .env.local.');
  console.log('\n👉 Instructions to add your free Gemini API key:');
  console.log('   1. Get your free key at: https://aistudio.google.com/app/apikey');
  console.log('   2. Open the file: .env.local in your editor.');
  console.log('   3. Set line 10 to:');
  console.log('      GEMINI_API_KEY=AIzaSy...');
  console.log('   4. Save the file and run: npm run check:models\n');
  process.exit(0);
}

// Safely mask the secret key (Never display full key)
const maskedKey = apiKey.length > 10
  ? `${apiKey.slice(0, 8)}...${apiKey.slice(-4)}`
  : 'AIza...****';

console.log(`🔑 Gemini API Key detected: [${maskedKey}] (Key is kept confidential)`);
console.log('📡 Querying Google Gemini API to inspect models available to your project...\n');

const ai = new GoogleGenAI({ apiKey });

async function verifyGeminiAccountAndModels() {
  try {
    // 1. Query live models directly from Google Gemini API
    const modelsPager = await ai.models.list({ config: { pageSize: 100 } });
    const allModels = [];

    for await (const m of modelsPager) {
      // model names typically come as "models/gemini-2.5-flash"
      const cleanName = m.name ? m.name.replace(/^models\//, '') : '';
      if (cleanName) {
        allModels.push(cleanName);
      }
    }

    console.log('✅ Connection Successful!');
    console.log(`📊 Total Gemini models available in your project: ${allModels.length}\n`);

    // Filter relevant text/multimodal models
    const relevantModels = allModels
      .filter((id) => id.includes('gemini') || id.includes('gemma'))
      .sort();

    console.log('Supported Gemini Models in your project:');
    relevantModels.forEach((id) => {
      const isRecommended = id.includes('flash') ? ' (Recommended for fast chat)' : '';
      console.log(`   • ${id}${isRecommended}`);
    });

    // 2. Verify currently configured GEMINI_MODEL
    const configuredModel = process.env.GEMINI_MODEL || 'gemini-3-flash-preview';
    console.log(`\n⚙️ Configured GEMINI_MODEL: "${configuredModel}"`);

    const isSupported = allModels.includes(configuredModel);
    if (isSupported) {
      console.log(`✅ Model "${configuredModel}" is confirmed and active in your project.`);
    } else {
      console.log(`⚠️ Model "${configuredModel}" was not found in your project list.`);
      const fallback = relevantModels.find((m) => m.includes('flash')) || relevantModels[0];
      console.log(`   Recommended alternative: ${fallback}`);
    }

    // 3. Test a quick live response
    console.log('\n🧪 Testing a live response from Google Gemini API...');
    const testResponse = await ai.models.generateContent({
      model: configuredModel,
      contents: 'You are Aaum Creations support. Reply with exactly two words: "Aaum Connected".',
      config: {
        maxOutputTokens: 300,
        temperature: 0.1,
      },
    });

    const reply = testResponse?.text || '';
    console.log(`🎉 Gemini Test Call PASSED!`);
    console.log(`   Server Reply: "${reply.trim()}"`);
    console.log('\n✨ Your Google Gemini API integration is fully verified and working!');

  } catch (err) {
    console.error('\n❌ Google Gemini connection failed:', err.message);

    const msg = String(err.message || '');
    if (err.status === 400 || msg.includes('API_KEY_INVALID') || msg.includes('invalid API key')) {
      console.log('👉 Error: Invalid API key. Please check your GEMINI_API_KEY in .env.local.');
    } else if (err.status === 429 || msg.includes('RESOURCE_EXHAUSTED')) {
      console.log('👉 Error 429: Quota or rate limit exceeded on your Google AI Studio project.');
      console.log('   Check your quota at https://aistudio.google.com/.');
    } else {
      console.log(`👉 Error Status: ${err.status || 'API Error'}`);
    }
  }

  console.log('\n====================================================\n');
}

verifyGeminiAccountAndModels();
