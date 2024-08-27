"use client";

import { useQuery } from "@tanstack/react-query";
import { HTTPError } from "ky";
import { useRouter } from "next/navigation";
import { useToast } from "~/components/ui/use-toast";
import { api } from "~/lib/api";
import { CurrentUser } from "~/types/user";

export const useCurrentUser = () => {
  const { toast } = useToast();
  const { push } = useRouter();

  return useQuery({
    queryKey: ["current-user"],
    queryFn: async () => {
      const res = await api.get("users/me");
      const user = await res.json<CurrentUser>();
      return user;
    },
    /**
     * Retry
     */
    retry: (count, err) => {
      if (count >= 3) return false;

      if (err instanceof HTTPError) {
        const code = err.response.status;

        // Unauthorized
        if (code === 401) {
          toast({
            title: "Unauthorized",
            description: `Authentication is required!`,
            variant: "destructive",
          });

          push("/auth/sign-in");

          return false;
        }
      }

      return true;
    },
  });
};
