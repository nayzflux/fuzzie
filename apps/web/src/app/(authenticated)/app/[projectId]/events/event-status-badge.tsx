import { cn } from "~/lib/utils";
import { EventStatus } from "~/types/event";

export default function EventStatusBadge({ status }: { status: EventStatus }) {
  return (
    <span
      className={cn(
        "px-2 py-1 rounded bg-opacity-30 text-xs",
        (status === "TRIGGERED" || status === "REPLAYED") &&
          "bg-blue-600 text-blue-600 border-blue-500",
        status === "NOT_DELIVERED" && "bg-red-600 text-red-500 ",
        status === "DELIVERED" && "bg-green-600 text-green-500"
      )}
    >
      {status}
    </span>
  );
}
