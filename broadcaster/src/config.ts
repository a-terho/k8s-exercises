import 'dotenv/config';

const config = {
  operating_mode: process.env.OPERATING_MODE || 'log',
  nats_uri: process.env.NATS_URI || 'nats://nats:4222',
  discord_webhook: process.env.DISCORD_WEBHOOK || '',
  telegram_bot_token: process.env.TELEGRAM_BOT_TOKEN,
  telegram_chat_id: process.env.TELEGRAM_CHAT_ID,
};

export default config;
