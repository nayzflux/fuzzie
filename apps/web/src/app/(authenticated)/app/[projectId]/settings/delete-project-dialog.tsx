import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
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
import { Project } from "~/types/project";

export default function DeleteProjectDialog() {
  const { projectId } = useParams() as { projectId: string };
  const { push } = useRouter();

  const queryClient = useQueryClient();
  const { mutate: remove } = useMutation({
    mutationKey: ["delete-project", projectId],
    mutationFn: async () => {
      const res = await api.delete(`projects/${projectId}`);
      const project = (await res.json()) as Project;
      return project;
    },
    onSuccess: (project) => {
      toast({
        title: "Project deleted",
        description: `${project.name} has been deleted.`,
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["project"] });
      push("/app");
    },
  });

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">Delete project</Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete project</AlertDialogTitle>
          <AlertDialogDescription>
            Project will be permantly removed from our servers. This action
            cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>

          <Button variant="destructive" asChild>
            <AlertDialogAction onClick={() => remove()}>
              Delete project
            </AlertDialogAction>
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
