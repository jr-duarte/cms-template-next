import { connect, disconnect } from 'mongoose';

export function mongoConnect() {
  return connect(process.env.MONGODB_CONNECTION_STRING as string);
}

export function mongoDisconnect() {
  return disconnect();
}
