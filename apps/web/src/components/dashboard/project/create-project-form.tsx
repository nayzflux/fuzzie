"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { HTTPError } from "ky";
import { Loader2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
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
import { Project } from "~/types/project";

const formSchema = z.object({
  name: z.string().min(1).max(32),
});

export default function CreateProjectForm() {
  const { push } = useRouter();
  const { toast } = useToast();

  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationKey: ["create-project"],
    /**
     * Mutate function
     */
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      const res = await api.post("projects", {
        json: values,
      });
      const project = (await res.json()) satisfies Project;
      return project;
    },
    /**
     * Retry
     */
    retry: (count, err) => {
      if (count >= 3) return false;

      if (err instanceof HTTPError) {
        const code = err.response.status;

        // Rate limited
        if (code === 429) return false;

        // Unauthorized
        if (code === 401) return false;
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

        // Unauthorized
        if (code === 401) {
          return toast({
            title: "Unauthorized",
            description: `Authentication is required!`,
            variant: "destructive",
          });
        }
      }

      toast({
        title: "Error",
        description: `Unknown error! Please try-again.`,
        variant: "destructive",
      });
    },
    /**
     * Handle success
     */
    onSuccess: (project) => {
      toast({
        title: "Project created",
        description: `${project.name} has been created successfully!`,
      });

      push(`/app/${project.id}`);
    },
    /**
     * After
     */
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
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
              <FormLabel>Name</FormLabel>

              <FormControl>
                <Input
                  placeholder="My Awesome Project"
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
          Create project
        </Button>
      </form>
    </Form>
  );
}
