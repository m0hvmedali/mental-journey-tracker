import { startServer, createApp } from './server/api/server';

export { createApp };

// Only start the server directly if we are running the server process itself
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  startServer().catch((err) => {
    console.error('Fatal Server Boot Error:', err);
    process.exit(1);
  });
}

