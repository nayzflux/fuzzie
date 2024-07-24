import { logger, task } from "@trigger.dev/sdk/v3";
import ky, { HTTPError } from "ky";
import crypto from "node:crypto";
import { decrypt } from "~/utils/encryption";

export const runWebhookRequest = task({
  id: "run-webhook-request-task",
  machine: {
    preset: "micro",
  },
  retry: {
    maxAttempts: 0,
  },
  run: async (payload: any, { ctx }) => {
    logger.log(
      `Running webhook request ${payload.webhookRequest.id} for event ${payload.webhookRequest.eventId}`
    );

    const retry = payload.retry || 0;
    const sentAt = new Date();

    try {
      /**
       * Decrypt secret
       */
      const secret = decrypt(
        payload.secret,
        process.env.WEBHOOK_SECRET_SECRET!
      );

      /**
       * Construct body
       */
      const body = {
        event: payload.eventName,
        data: payload.data,
        sentAt,
      };

      /**
       * Create signature
       */
      const signature = crypto
        .createHmac("sha256", secret)
        .update(JSON.stringify(body))
        .digest("base64");

      /**
       * Send webhook request
       */

      const requestHeaders = {
        "Content-Type": "application/json",
        Signature: signature,
      };

      const res = await ky.post(payload.url, {
        json: body,
        headers: requestHeaders,
      });

      logger.log(`Webhook delivered`, { h: res.headers });

      const responseBody = await res.json();

      /**
       * Trigger webhook request succeeded event
       */
      const body2 = {
        event: "webhook_request.succeeded",
        data: {
          id: payload.webhookRequest.id,
          eventId: payload.webhookRequest.eventId,
          sentAt,

          requestUrl: res.url,
          requestBody: body,
          requestHeaders: requestHeaders,

          responseBody: responseBody,
          responseCode: res.status,
          responseHeaders: res.headers,
          retry,
        },
        sentAt: new Date(),
      };

      const signature2 = crypto
        .createHmac("sha256", process.env.INTERNAL_WEBHOOK_SECRET!)
        .update(JSON.stringify(body2))
        .digest("base64");

      await ky.post(`http://localhost:5000/api/webhook/internal`, {
        json: body2,
        headers: {
          Signature: signature2,
        },
        retry: 5,
      });

      return {
        success: true,
        output: body2,
      };
    } catch (err) {
      logger.log(`Failed to deliver webhook`);

      /**
       * Trigger webhook request failed event
       */
      let body2: any = {
        event: "webhook_request.failed",
        data: {
          id: payload.webhookRequest.id,
          eventId: payload.webhookRequest.eventId,
          sentAt,
          retry,
        },
        sentAt: new Date(),
      };

      logger.log("err", { err });

      if (err instanceof HTTPError) {
        const requestHeaders = err.request.headers;
        const requestBody = await err.request.json();
        const requestUrl = err.request.url;

        const responseHeaders = err.response.headers;
        const responseBody = await err.response.json();
        const requestCode = err.response.status;

        body2 = {
          event: "webhook_request.failed",
          data: {
            id: payload.webhookRequest.id,
            eventId: payload.webhookRequest.eventId,
            sentAt,

            requestUrl: requestUrl,
            requestBody: requestBody,
            requestHeaders: requestHeaders,

            responseBody: responseBody,
            responseCode: requestCode,
            responseHeaders: responseHeaders,

            retry,
          },
          sentAt: new Date(),
        };
      }

      const signature2 = crypto
        .createHmac("sha256", process.env.INTERNAL_WEBHOOK_SECRET!)
        .update(JSON.stringify(body2))
        .digest("base64");

      await ky.post(`http://localhost:5000/api/webhook/internal`, {
        json: body2,
        headers: {
          Signature: signature2,
        },
        retry: 5,
      });

      return {
        success: false,
        output: body2,
      };
    }
  },
});
