import ky, { HTTPError } from "ky";

export interface IClient {
  apiKey: string;
  projectId: string;
  apiUrl: string;
}

export interface ClientOptions {
  apiKey: string;
  projectId: string;
  host?: string;
}

export interface TriggerEventBody {
  name: string;
  data: Record<string, unknown>;
  webhookUrl: string;
  webhookSecret: string;
}

export interface TriggeredEvent {
  status: "TRIGGERED" | "REPLAYED" | "DELIVERED" | "NOT_DELIVERED" | null;
  id: string;
  name: string;
  data: Record<string, unknown>;
  createdAt: Date;
  projectId: string;
  webhookUrl: string;
}

export class Client implements IClient {
  apiUrl = "https://api.fuzzie.dev/api/";
  projectId;
  apiKey;
  httpClient;

  constructor({ apiKey, projectId, host }: ClientOptions) {
    this.apiKey = apiKey;
    this.projectId = projectId;

    if (host) {
      this.apiUrl = host + "/api";
    }

    /**
     * Create an HTTP Client with API key and API url
     */
    this.httpClient = ky.create({
      headers: {
        "X-API-Key": this.apiKey,
      },
      prefixUrl: this.apiUrl,
    });
  }

  async trigger(event: TriggerEventBody) {
    try {
      const res = await this.httpClient.post(`projects/${this.projectId}/events`, {
        json: event,
      });

      const triggeredEvent = (await res.json()) satisfies TriggeredEvent;

      return triggeredEvent;
    } catch (err) {
      if (err instanceof HTTPError) {
        const code = err.response.status;

        if (code === 401)
          throw new Error("401 - Unauthorized: API key is required");
        if (code === 403)
          throw new Error(
            "403 - Forbidden: Not allowed to trigger events in this project"
          );
      }

      throw err;
    }
  }
}
