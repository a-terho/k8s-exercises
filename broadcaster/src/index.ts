import config from './config.ts';
import { connect, type NatsConnection } from '@nats-io/transport-node';
import { sendMessage } from './telegram.ts';

let nc: NatsConnection;

export const initialize = async () => {
  nc = await connect({ servers: config.nats_uri });

  const todoSavedSub = nc.subscribe('todo_saved', {
    // create a queue group so only one of the workers receives the message
    queue: 'broadcaster.workers',
  });
  (async () => {
    for await (const msg of todoSavedSub) {
      // console.log(`received: ${msg.string()}`);
      console.log('Sending a message to Telegram chat...');
      await sendMessage('New todo was added!');
    }
    console.log('Subscription todo_saved closed');
  })();

  const todoUpdatedSub = nc.subscribe('todo_updated', {
    // create a queue group so only one of the workers receives the message
    queue: 'broadcaster.workers',
  });
  (async () => {
    for await (const msg of todoUpdatedSub) {
      // console.log(`received: ${msg.string()}`);
      console.log('Sending a message to Telegram chat...');
      await sendMessage('Todo was updated!');
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
