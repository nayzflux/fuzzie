import { Client, type ClientOptions } from "./Client";

export function createClient(options: ClientOptions) {
  return new Client(options);
}
