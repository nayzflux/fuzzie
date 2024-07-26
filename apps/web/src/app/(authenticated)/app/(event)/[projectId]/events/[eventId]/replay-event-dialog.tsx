"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
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
import { Event } from "~/types/event";

export default function ReplayEventDialog() {
  const { eventId } = useParams() as { eventId: string };

  const queryClient = useQueryClient();
  const { mutate: replay } = useMutation({
    mutationKey: ["replay", eventId],
    mutationFn: async () => {
      const res = await api.post(`events/${eventId}/replay`);
      const event = (await res.json()) as Event;
      return event;
    },
    onSuccess: (event) => {
      toast({
        title: "Event replayed",
        description: `${event.name} is being replayed...`,
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      queryClient.invalidateQueries({ queryKey: ["events", eventId] });
      queryClient.invalidateQueries({
        queryKey: ["webhook-requests", eventId],
      });
    },
  });

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline">Replay event</Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Replay event</AlertDialogTitle>
          <AlertDialogDescription>
            Any scheduled request will be canceled and a new webhook request
            will be scheduled.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>

          <AlertDialogAction onClick={() => replay()}>
            Replay event
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
