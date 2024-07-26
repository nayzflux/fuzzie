import { CheckCircleIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { Loader2Icon } from "lucide-react";
import { cn } from "~/lib/utils";
import { EventStatus } from "~/types/event";

export default function EventStatusBadge({ status }: { status: EventStatus }) {
  return (
    <span
      className={cn(
        "px-2 py-1 rounded bg-opacity-30 text-xs inline-flex items-center",
        (status === "TRIGGERED" || status === "REPLAYED") &&
          "bg-blue-600 text-blue-600 border-blue-500",
        status === "NOT_DELIVERED" && "bg-red-600 text-red-500 ",
        status === "DELIVERED" && "bg-green-600 text-green-500"
      )}
    >
      {(status === "TRIGGERED" || status === "REPLAYED") && (
        <Loader2Icon className="size-3 mr-1 animate-spin" />
      )}
      {status === "DELIVERED" && <CheckCircleIcon className="size-3 mr-1" />}
      {status === "NOT_DELIVERED" && <XMarkIcon className="size-3 mr-1" />}
      {status}
    </span>
  );
}
