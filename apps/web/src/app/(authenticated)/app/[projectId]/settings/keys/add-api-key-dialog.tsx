"use client";

import { CheckCircleIcon, ClipboardIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Label } from "~/components/ui/label";
import CreateApiKeyForm from "./create-api-key-form";

export default function AddApiKeyDialog() {
  const [key, setKey] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  const copy = () => {
    if (!key) return;
    navigator.clipboard.writeText(key);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const onOpenChange = (open: boolean) => {
    if (open === true) {
      setKey(null);
      setCopied(false);
    }
  };

  return (
    <Dialog onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button>Add API key</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>{key ? "Copy API key" : "Add API key"}</DialogTitle>

          <DialogDescription>
            {key
              ? "This won't be shown again."
              : "Add a new API key to interact with Fuzzie API."}
          </DialogDescription>
        </DialogHeader>

        {key ? (
          <div className="flex flex-col gap-2">
            <Label>API key</Label>
            <div className="flex items-center h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50">
              <input
                className="w-full bg-transparent outline-none"
                defaultValue={key}
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
          </div>
        ) : (
          <CreateApiKeyForm setKey={setKey} />
        )}
      </DialogContent>
    </Dialog>
  );
}
