import config from './config.ts';
import { connect, type NatsConnection } from '@nats-io/transport-node';
import { sendMessage } from './telegram.ts';

let nc: NatsConnection;

export const initialize = async () => {
  nc = await connect({ servers: config.nats_uri });

  const namespace = config.operating_mode;

  const todoSavedSub = nc.subscribe(`${namespace}.todo_saved`, {
    // create a queue group so only one of the workers receives the message
    queue: `broadcaster.workers.${namespace}`,
  });
  (async () => {
    for await (const msg of todoSavedSub) {
      // console.log(`received: ${msg.string()}`);
      const message = 'New todo was added!';
      if (config.operating_mode === 'forward') {
        console.log('Sending a message to Telegram chat...');
        await sendMessage(message);
      } else {
        console.log(message);
      }
    }
    console.log('Subscription todo_saved closed');
  })();

  const todoUpdatedSub = nc.subscribe(`${namespace}.todo_updated`, {
    // create a queue group so only one of the workers receives the message
    queue: `broadcaster.workers.${namespace}`,
  });
  (async () => {
    for await (const msg of todoUpdatedSub) {
      // console.log(`received: ${msg.string()}`);
      const message = 'Todo was updated!';
      if (config.operating_mode === 'forward') {
        console.log('Sending a message to Telegram chat...');
        await sendMessage(message);
      } else {
        console.log(message);
      }
    }
    console.log('Subscription todo_updated closed');
  })();
};

const main = async () => {
  try {
    await initialize();
    console.log('Successfully connected to NATS');
  } catch (err) {
    console.log('Failed to connect to NATS');
  }
};

main();
