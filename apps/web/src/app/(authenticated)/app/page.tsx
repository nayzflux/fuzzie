import CreateProjectDialog from "~/components/dashboard/project/create-project-dialog";
import ProjectList from "~/components/dashboard/project/project-list";

export default function DashboardPage() {
  return (
    <div className="flex flex-col px-4 sm:px-16 lg:px-32 xl:px-64 2xl:px-96 py-4 sm:py-16 border-t gap-4 sm:gap-16">
      <div className="flex justify-between items-center gap-8">
        <h1 className="text-2xl font-semibold">Your projects</h1>
        <CreateProjectDialog />
      </div>

      <ProjectList />
    </div>
  );
}
