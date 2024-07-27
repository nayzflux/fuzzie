import { useMutation, useQueryClient } from "@tanstack/react-query";
import { HTTPError } from "ky";
import { useParams } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog";
import { Button } from "~/components/ui/button";
import { toast } from "~/components/ui/use-toast";
import { api } from "~/lib/api";
import { ApiKey } from "~/types/api-key";

export default function RevokeApiKeyDialog({ apiKeyId }: { apiKeyId: string }) {
  const { projectId } = useParams() as { projectId: string };

  const queryClient = useQueryClient();
  const { mutate: revoke, isPending } = useMutation({
    mutationKey: ["api-keys", projectId],
    mutationFn: async () => {
      const res = await api.delete(`keys/${apiKeyId}`);
      const apiKey = (await res.json()) satisfies ApiKey;
      return apiKey;
    },
    /**
     * Retry
     */
    retry: (count, err) => {
      if (count >= 3) return false;

      if (err instanceof HTTPError) {
        const code = err.response.status;

        // Unauthorized
        if (code === 401) return false;
        // Forbidden
        if (code === 403) return false;
        // Not found
        if (code === 404) return false;
        // Rate limited
        if (code === 429) return false;
      }

      return true;
    },
    /**
     * Handle error
     */
    onError: (err) => {
      if (err instanceof HTTPError) {
        const code = err.response.status;

        // Rate limited
        if (code === 429) {
          return toast({
            title: "Rate limited",
            description: `Slow down! You're being rate limited.`,
            variant: "destructive",
          });
        }

        // Forbidden
        if (code === 403) {
          return toast({
            title: "Forbidden",
            description: `You're not allow to do this action!`,
            variant: "destructive",
          });
        }

        // Unauthorized
        if (code === 401) {
          return toast({
            title: "Unauthorized",
            description: `Authentication is required!`,
            variant: "destructive",
          });
        }

        // Not found
        if (code === 404) {
          return toast({
            title: "Not found",
            description: `API key doesn't exists!`,
            variant: "destructive",
          });
        }
      }

      // Unknown error
      toast({
        title: "Error",
        description: `Unknown error! Please try-again.`,
        variant: "destructive",
      });
    },
    /**
     * Handle success
     */
    onSuccess: (apiKey) => {
      toast({
        title: "API key revoked",
        description: `${apiKey.name} has been revoked successfully!`,
      });
    },
    /**
     * After
     */
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["api-keys", projectId] });
    },
  });

  return (
    <AlertDialog>
      <AlertDialogTrigger>Revoke key</AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Revoke API key</AlertDialogTitle>
          <AlertDialogDescription>
            This API key won&apos;t be usable anymore.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>

          <Button variant="destructive" onClick={() => revoke()} asChild>
            <AlertDialogAction>Revoke API key</AlertDialogAction>
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
