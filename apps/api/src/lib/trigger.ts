import { configure } from "@trigger.dev/sdk/v3";
import { env } from "~/lib/env";

configure({ secretKey: env.TRIGGER_SECRET_KEY });
