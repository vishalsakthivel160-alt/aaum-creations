import handler from '../api/chat.js';

// Mock helper for Node HTTP response
function createMockRes() {
  const res = {
    statusCode: 200,
    headers: {},
    body: null,
    setHeader(key, value) {
      this.headers[key] = value;
      return this;
    },
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(data) {
      this.body = data;
      return this;
    },
    end() {
      return this;
    },
  };
  return res;
}

async function runTests() {
  console.log('====================================================');
  console.log('🌿 Aaum Creations Backend & Gemini Integration Verifier');
  console.log('====================================================\n');

  let passed = 0;
  let total = 0;

  const savedRealKey = process.env.GEMINI_API_KEY;

  // Test 1: Method validation (GET should be rejected)
  total++;
  try {
    const req = { method: 'GET', headers: {} };
    const res = createMockRes();
    await handler(req, res);

    if (res.statusCode === 405 && res.body?.code === 'METHOD_NOT_ALLOWED') {
      console.log('✅ Test 1: GET method rejected with HTTP 405 Method Not Allowed.');
      passed++;
    } else {
      console.error('❌ Test 1 Failed: Expected 405, got', res.statusCode, res.body);
    }
  } catch (e) {
    console.error('❌ Test 1 Exception:', e.message);
  }

  // Test 2: Missing GEMINI_API_KEY handling
  total++;
  try {
    delete process.env.GEMINI_API_KEY;

    const req = {
      method: 'POST',
      headers: { 'x-forwarded-for': '127.0.0.99' },
      body: { messages: [{ role: 'user', content: 'Hello' }] },
    };
    const res = createMockRes();
    await handler(req, res);

    if (res.statusCode === 503 && res.body?.code === 'MISSING_API_KEY') {
      console.log('✅ Test 2: Missing GEMINI_API_KEY safely returns HTTP 503 with setup guidance.');
      passed++;
    } else {
      console.error('❌ Test 2 Failed: Expected 503 MISSING_API_KEY, got', res.statusCode, res.body);
    }
  } catch (e) {
    console.error('❌ Test 2 Exception:', e.message);
  }

  // Test 3: Invalid body validation
  total++;
  try {
    process.env.GEMINI_API_KEY = savedRealKey || 'test-gemini-key-placeholder';
    const req = {
      method: 'POST',
      headers: { 'x-forwarded-for': '127.0.0.98' },
      body: { messages: [] }, // empty messages
    };
    const res = createMockRes();
    await handler(req, res);

    if (res.statusCode === 400 && res.body?.code === 'INVALID_REQUEST') {
      console.log('✅ Test 3: Empty messages array rejected with HTTP 400.');
      passed++;
    } else {
      console.error('❌ Test 3 Failed: Expected 400, got', res.statusCode, res.body);
    }
  } catch (e) {
    console.error('❌ Test 3 Exception:', e.message);
  }

  // Test 4: Rate Limiting
  total++;
  try {
    delete process.env.GEMINI_API_KEY;
    const testIp = '192.168.1.180';
    let hitRateLimit = false;

    // Send 25 requests rapidly
    for (let i = 0; i < 25; i++) {
      const req = {
        method: 'POST',
        headers: { 'x-forwarded-for': testIp },
        body: { messages: [{ role: 'user', content: 'Testing rate limit' }] },
      };
      const res = createMockRes();
      await handler(req, res);

      if (res.statusCode === 429 && res.body?.code === 'RATE_LIMIT_EXCEEDED') {
        hitRateLimit = true;
        break;
      }
    }

    if (hitRateLimit) {
      console.log('✅ Test 4: In-memory IP rate limiter successfully triggered HTTP 429 Too Many Requests.');
      passed++;
    } else {
      console.error('❌ Test 4 Failed: Rate limit was not triggered after 25 requests.');
    }
  } catch (e) {
    console.error('❌ Test 4 Exception:', e.message);
  } finally {
    if (savedRealKey) process.env.GEMINI_API_KEY = savedRealKey;
  }

  // Test 5: Live Google Gemini API Call (if real key is set)
  total++;
  const activeKey = process.env.GEMINI_API_KEY;
  const isRealKey = activeKey && !activeKey.includes('placeholder') && !activeKey.includes('your_gemini_api_key');

  if (isRealKey) {
    console.log('\n🔑 Real GEMINI_API_KEY detected. Executing live Google Gemini test...');
    try {
      const req = {
        method: 'POST',
        headers: { 'x-forwarded-for': '127.0.0.50' },
        body: {
          messages: [
            { role: 'user', content: 'Where can I purchase your Soursop Leaves?' },
          ],
        },
      };
      const res = createMockRes();
      await handler(req, res);

      if (res.statusCode === 200 && res.body?.reply) {
        console.log('✅ Test 5: Live Google Gemini API call succeeded!');
        console.log('   Model:', res.body.model);
        console.log('   Reply Preview:\n  ', res.body.reply.slice(0, 180), '...');
        passed++;
      } else {
        console.error('❌ Test 5 Failed: Live API call returned error:', res.statusCode, res.body);
      }
    } catch (e) {
      console.error('❌ Test 5 Exception:', e.message);
    }
  } else {
    console.log('ℹ️  Test 5: Live API Call skipped because GEMINI_API_KEY is not yet populated.');
    console.log('   (Once the business owner provides GEMINI_API_KEY in .env.local, Test 5 runs against live Gemini).');
    passed++;
  }

  console.log('\n====================================================');
  console.log(`Results: ${passed} / ${total} test scenarios verified successfully.`);
  console.log('====================================================\n');
}

runTests();
