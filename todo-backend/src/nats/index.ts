import { connect, type NatsConnection } from '@nats-io/transport-node';

let nc: NatsConnection;

export const initialize = async () => {
  nc = await connect({
    servers: process.env.NATS_URL || 'nats://nats:4222',
  });
};

export const publish = (subject: string, message: string) => {
  // silently ignore if NATS connection is not available
  if (!nc) return false;

  console.log(`publishing to '${subject}': ${message}`);
  nc.publish(subject, message);
  return true;
};

const nats = { initialize, publish };
export default nats;
