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
import { api } from "~/lib/api";
import { CurrentUser } from "~/types/user";
import { useToast } from "../ui/use-toast";

const formSchema = z.object({
  email: z.string().email().max(320),
  password: z.string().min(8).max(1024),
});

export default function SignInForm() {
  const { push } = useRouter();
  const { toast } = useToast();

  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationKey: ["sign-up"],
    /**
     * Mutate function
     */
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      const res = await api.post("auth/sign-in", {
        json: values,
      });

      const user = (await res.json()) satisfies CurrentUser;

      return user;
    },
    /**
     * Retry
     */
    retry: (count, err) => {
      if (count >= 3) return false;

      if (err instanceof HTTPError) {
        const code = err.response.status;

        // Rate limited
        if (code === 4029) return false;

        // Forbidden
        if (code === 403) return false;
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
            title: "Sign-Up failed",
            description: `Slow down! You're being rate limited.`,
            variant: "destructive",
          });
        }

        // Forbidden
        if (code === 403) {
          return toast({
            title: "Sign-In failed",
            description: `Invalid email and password!`,
            variant: "destructive",
          });
        }
      }

      toast({
        title: "Sign-In failed",
        description: `Unknown error! Please try-again.`,
        variant: "destructive",
      });
    },
    /**
     * Handle success
     */
    onSuccess: (user) => {
      toast({
        title: "Signed-Up",
        description: `${user.email} account has been created successfully!`,
      });

      push("/app");
    },
    /**
     * After
     */
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["current-user"] });
    },
  });

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
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
        {/* Email */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>

              <FormControl>
                <Input
                  placeholder="name@example.com"
                  {...field}
                  disabled={isPending}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        {/* Email */}
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>

              <FormControl>
                <Input
                  type="password"
                  placeholder="************"
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
          Sign In
        </Button>
      </form>
    </Form>
  );
}
