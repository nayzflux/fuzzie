"use client";

import { useState } from "react";
import { CopyToClipboard } from "~/components/copy-to-clipboard";
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

  const onOpenChange = (open: boolean) => {
    if (open === true) {
      setKey(null);
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

            <CopyToClipboard value={key} />
          </div>
        ) : (
          <CreateApiKeyForm setKey={setKey} />
        )}
      </DialogContent>
    </Dialog>
  );
}
