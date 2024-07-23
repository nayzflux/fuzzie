"use client";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { cn } from "~/lib/utils";

const routes = [
  {
    href: "/app/[projectId]",
    label: "Overview",
  },
  {
    href: "/app/[projectId]/events",
    label: "Events",
  },
  {
    href: "/app/[projectId]/keys",
    label: "API Keys",
  },
];

export default function ProjectNav() {
  const { projectId } = useParams() as { projectId: string };
  const pathname = usePathname();

  console.log(pathname);

  return (
    <nav>
      <ul className="flex px-4 sm:px-16 lg:px-32 xl:px-64 2xl:px-96">
        {routes.map(({ href, label }) => (
          <Link key={href} href={href.replace("[projectId]", projectId)}>
            <li
              key={href}
              className={cn(
                "p-4 text-sm",
                pathname === href.replace("[projectId]", projectId) &&
                  "border-b border-white cursor-pointer"
              )}
            >
              {label}
            </li>
          </Link>
        ))}
      </ul>
    </nav>
  );
}
