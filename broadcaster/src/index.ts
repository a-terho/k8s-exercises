import 'dotenv/config';
import { connect, type NatsConnection } from '@nats-io/transport-node';

let nc: NatsConnection;

export const initialize = async () => {
  nc = await connect({
    servers: process.env.NATS_URL || 'nats://nats:4222',
  });

  const todoCreatedSub = nc.subscribe('todo_saved');
  (async () => {
    for await (const msg of todoCreatedSub) {
      console.log(`received: ${msg.string()}`);
    }
  })();

  const todoUpdatedSub = nc.subscribe('todo_updated');
  (async () => {
    for await (const msg of todoUpdatedSub) {
      console.log(`received: ${msg.string()}`);
    }
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
