import { connect, type NatsConnection } from '@nats-io/transport-node';
import config from '../config.ts';

let nc: NatsConnection;

export const initialize = async () => {
  nc = await connect({
    servers: process.env.NATS_URI || 'nats://nats:4222',
  });
};

export const publish = (subject: string, message: string) => {
  // silently ignore if NATS connection is not available
  if (!nc) return false;

  const subjectWithNamespace = `${config.operating_mode}.${subject}`;
  console.log(`publishing to '${subjectWithNamespace}': ${message}`);
  nc.publish(subjectWithNamespace, message);
  return true;
};

const nats = { initialize, publish };
export default nats;
