"use client";

import { Slash } from "lucide-react";
import Link from "next/link";
import {
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from "~/components/ui/breadcrumb";
import { Skeleton } from "~/components/ui/skeleton";
import UserAvatar from "~/components/user/user-avatar";
import { useCurrentUser } from "~/hooks/use-current-user";

export default function UserItem() {
  const { data: user, isPending } = useCurrentUser();

  return (
    <>
      <BreadcrumbSeparator>
        <Slash />
      </BreadcrumbSeparator>

      <BreadcrumbItem>
        {isPending ? (
          <Skeleton className="size-6 rounded-full sm:rounded-lg sm:w-60 h-5" />
        ) : (
          <BreadcrumbLink>
            <Link
              href="/app"
              className="flex items-center text-muted-foreground"
            >
              <UserAvatar
                width={24}
                height={24}
                user={user}
                className="size-6 mr-2"
              />

              <p className="hidden sm:inline">{user?.email}</p>
            </Link>
          </BreadcrumbLink>
        )}
      </BreadcrumbItem>
    </>
  );
}
