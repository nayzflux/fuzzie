"use client";

import UpdateEmailForm from "~/components/account/update-email-form";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Skeleton } from "~/components/ui/skeleton";
import { useCurrentUser } from "~/hooks/use-current-user";

export default function AccountPage() {
  const { data: user, isPending } = useCurrentUser();

  return (
    <div className="flex flex-col gap-8 w-full">
      {/* Avatar */}
      <Card>
        <CardHeader>
          <CardTitle>Your avatar</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="flex flex-col gap-4">
            {isPending || !user ? (
              <Skeleton className="size-32 rounded-full" />
            ) : (
              <img
                src={`https://avatar.vercel.sh/${user.id}`}
                alt="Account avatar"
                className="size-32 rounded-full"
              />
            )}
          </div>
        </CardContent>
      </Card>

      {/* Email */}
      <Card>
        <CardHeader>
          <CardTitle>Your email</CardTitle>
        </CardHeader>

        <CardContent>
          {isPending || !user ? (
            <div className="flex flex-col gap-4">
              <Skeleton className="h-9 w-full" />

              <div className="flex justify-end">
                <Button variant="outline" disabled>
                  Save changes
                </Button>
              </div>
            </div>
          ) : (
            <UpdateEmailForm user={user} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
