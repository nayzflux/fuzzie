"use client";

import Logo from "~/components/logo";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
} from "~/components/ui/breadcrumb";
import ProjectItem from "./project-item";
import UserItem from "./user-item";

export default function DashboardNav() {
  return (
    <nav>
      <Breadcrumb>
        <BreadcrumbList>
          {/* Home */}
          <BreadcrumbItem>
            <Logo width={24} height={24} className="size-6 rounded-full" />
          </BreadcrumbItem>

          {/* Projects */}
          <UserItem />

          {/* Project */}
          <ProjectItem />
        </BreadcrumbList>
      </Breadcrumb>
    </nav>
  );
}
