import { CheckIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { Loader2Icon } from "lucide-react";
import { cn } from "~/lib/utils";

export default function WebhookRequestStatusBadge({
  status,
}: {
  status: "SCHEDULED" | "SUCCEEDED" | "FAILED";
}) {
  return (
    <span
      className={cn(
        " inline-flex items-center px-2 py-1 rounded bg-opacity-30 text-xs",
        status === "SCHEDULED" && "bg-blue-600 text-blue-600 border-blue-500",
        status === "FAILED" && "bg-red-600 text-red-500 ",
        status === "SUCCEEDED" && "bg-green-600 text-green-500"
      )}
    >
      {status === "SCHEDULED" && (
        <Loader2Icon className="animate-spin size-3 mr-1" />
      )}
      {status === "FAILED" && <XMarkIcon className="size-3 mr-1" />}
      {status === "SUCCEEDED" && <CheckIcon className="size-3 mr-1" />}
      {status}
    </span>
  );
}
