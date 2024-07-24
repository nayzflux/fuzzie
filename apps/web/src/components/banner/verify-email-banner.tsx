"use client";

import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { useCurrentUser } from "~/hooks/use-current-user";

export default function VerifyEmailBanner() {
  const { data: user, isPending, isError } = useCurrentUser();

  if (isPending) return null;
  if (isError) return null;

  if (user.isEmailVerified) return null;

  return (
    <div className="fixed bottom-0 px-4 sm:px-16 lg:px-32 xl:px-64 2xl:px-96 pb-4 sm:pb-8 w-full">
      <Card className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-8 p-4 shadow-2xl ">
        <div className="flex items-center gap-2">
          <ExclamationTriangleIcon className="hidden sm:inline sm:size-5" />
          <p className="text-xs text-center sm:text-base sm:text-left">
            You need to verify your email adress before accessing Fuzzie
            features.
          </p>
        </div>

        <Button variant="outline" className="text-xs sm:text-sm">
          Send a new link
        </Button>
      </Card>
    </div>
  );
}
