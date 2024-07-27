"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { HTTPError } from "ky";
import { Loader2Icon } from "lucide-react";
import { useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { useToast } from "~/components/ui/use-toast";
import { api } from "~/lib/api";
import { CreatedApiKey } from "~/types/api-key";

const formSchema = z.object({
  name: z.string().min(1).max(32),
});

export default function CreateApiKeyForm({
  setKey,
}: {
  setKey: (key: string) => void;
}) {
  const { projectId } = useParams() as { projectId: string };
  const { toast } = useToast();

  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationKey: ["create-api-keys", projectId],
    /**
     * Mutate function
     */
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      const res = await api.post(`projects/${projectId}/keys`, {
        json: values,
      });
      const apiKey = (await res.json()) satisfies CreatedApiKey;
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
            description: `Project doesn't exists!`,
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
        title: "API key created",
        description: `${apiKey.name} has been created successfully!`,
      });

      setKey(apiKey.key);
    },
    /**
     * After
     */
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["api-keys", projectId] });
    },
  });

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    mutate(values);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
      >
        {/* Name */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>

              <FormControl>
                <Input
                  placeholder="My API key"
                  {...field}
                  disabled={isPending}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit button */}
        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending && <Loader2Icon className="size-4 mr-2 animate-spin" />}
          Add API key
        </Button>
      </form>
    </Form>
  );
}
