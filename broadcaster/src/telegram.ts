import config from './config.ts';
const apiBaseUrl = 'https://api.telegram.org';

// https://core.telegram.org/bots/api#sendmessage
export const sendMessage = async (text: string) => {
  try {
    const res = await fetch(
      `${apiBaseUrl}/bot${config.telegram_bot_token}/sendMessage`,
      {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: config.telegram_chat_id,
          text,
        }),
      },
    );
    if (!res.ok) {
      const text = await res.text();
      throw new Error(
        `Sending message failed (bad response): ${res.status} ${text}`,
      );
    }
    console.log('Message sent successfully!');
  } catch (err) {
    if (err instanceof Error) {
      console.log(err.message);
    }
  }
};
