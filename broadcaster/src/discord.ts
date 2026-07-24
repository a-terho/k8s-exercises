import config from './config.ts';

// https://docs.discord.com/developers/resources/webhook#execute-webhook
export const sendMessage = async (content: string) => {
  try {
    const res = await fetch(config.discord_webhook, {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content,
        username: 'Broadcaster',
        embeds: [{ color: 0x00a63e }],
      }),
    });
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
