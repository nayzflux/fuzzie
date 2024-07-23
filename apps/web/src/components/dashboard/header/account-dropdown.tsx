"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { useToast } from "~/components/ui/use-toast";
import UserAvatar from "~/components/user/user-avatar";
import { useCurrentUser } from "~/hooks/use-current-user";
import { api } from "~/lib/api";

export default function AccountDropdown() {
  const { toast } = useToast();
  const { push } = useRouter();

  const queryClient = useQueryClient();
  const { data: user, isPending } = useCurrentUser();
  const { mutate } = useMutation({
    mutationKey: ["sign-out"],
    mutationFn: async () => {
      const res = await api.post("auth/sign-out");
    },
    onSuccess: () => {
      toast({
        title: "Signed Out",
        description: "You have been disconnected from your account.",
      });

      push("/");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["current-user"] });
    },
  });

  if (isPending) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        {/* <Button
            variant="outline"
            className="hidden sm:flex items-center gap-2"
          >
            <UserAvatar width={16} height={16} user={user} className="size-4" />
            <p className="hidden sm:flex">{user?.email}</p>
          </Button> */}

        <UserAvatar
          width={32}
          height={32}
          user={user}
          className="size-6 sm:size-8"
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>My Account</DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem>
          <Link href="/account">Account</Link>
        </DropdownMenuItem>

        <DropdownMenuItem>
          <Link href="/account/subscription">Subscription</Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem>
          <Link href="/docs">Docs</Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem className="cursor-pointer" onClick={() => mutate()}>
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
