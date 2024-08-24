"use client";

import { CheckCircleIcon, ClipboardIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { cn } from "~/lib/utils";

export const CopyToClipboard = ({
  value,
  className,
}: {
  value: string;
  className?: string;
}) => {
  const [copied, setCopied] = useState<boolean>(false);

  const copy = () => {
    if (!value) return;
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={cn(
        "flex items-center h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
    >
      <input
        className="w-full bg-transparent outline-none"
        defaultValue={value}
        readOnly
      />

      <button className="ml-auto" onClick={() => copy()}>
        {copied ? (
          <CheckCircleIcon className="size-5 ml-2 text-green-500" />
        ) : (
          <ClipboardIcon className="ml-2 size-5" />
        )}
      </button>
    </div>
  );
};
