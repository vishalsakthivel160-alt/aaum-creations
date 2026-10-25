import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import handler from './api/chat.js';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Synchronize server-side environment variables from .env.local and .env
  const env = loadEnv(mode, process.cwd(), '');
  if (env.GEMINI_API_KEY) {
    process.env.GEMINI_API_KEY = env.GEMINI_API_KEY;
  }
  if (env.GEMINI_MODEL) {
    process.env.GEMINI_MODEL = env.GEMINI_MODEL;
  }

  return {
    plugins: [
      react(),
      {
        name: 'api-chat-dev-middleware',
        configureServer(server) {
          server.middlewares.use('/api/chat', async (req, res) => {
            // Add Express/Vercel compatibility helpers if not present
            if (!res.status) {
              res.status = function (statusCode) {
                res.statusCode = statusCode;
                return res;
              };
            }
            if (!res.json) {
              res.json = function (data) {
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(data));
              };
            }

            try {
              await handler(req, res);
            } catch (err) {
              console.error('Dev API Server error:', err);
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: err.message, code: 'INTERNAL_ERROR' }));
            }
          });
        },
      },
    ],
    server: {
      host: true,
      port: 5173,
      strictPort: true,
    },
  };
});
