import { cn } from "~/lib/utils";

export const HTTPCodeBadge = ({ code }: { code: number }) => {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-1 rounded bg-opacity-30 text-xs",
        code >= 200 &&
          code < 300 &&
          "bg-green-600 text-green-600 border-green-500",
        code >= 300 &&
          code < 400 &&
          "bg-blue-600 text-blue-600 border-blue-500",
        code >= 400 && "bg-red-600 text-red-500 "
      )}
    >
      {code}
    </span>
  );
};
