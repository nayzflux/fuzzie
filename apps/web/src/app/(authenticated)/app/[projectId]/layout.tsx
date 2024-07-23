import { ReactNode } from "react";
import ProjectNav from "~/components/dashboard/project/project-nav";

export default function ProjectLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col">
      {/* Project navigation */}
      <ProjectNav />

      {/* Project page */}
      <div className="px-4 sm:px-16 lg:px-32 xl:px-64 2xl:px-96 py-4 sm:py-16 border-t">
        {children}
      </div>
    </div>
  );
}
