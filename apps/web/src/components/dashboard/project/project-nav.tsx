"use client";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { CopyToClipboard } from "~/components/copy-to-clipboard";
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
    href: "/app/[projectId]/settings",
    href2: "/app/[projectId]/settings/keys",
    label: "Settings",
  },
];

export default function ProjectNav() {
  const { projectId } = useParams() as { projectId: string };
  const pathname = usePathname();

  return (
    <nav className="sticky top-[103px] border-b bg-background z-40">
      <ul className="flex px-4 sm:px-16 lg:px-32 xl:px-64 2xl:px-96 items-center">
        {routes.map(({ href, href2, label }) => (
          <Link key={href} href={href.replace("[projectId]", projectId)}>
            <li
              key={href}
              className={cn(
                "p-4 text-sm",
                (pathname === href.replace("[projectId]", projectId) ||
                  (href2 &&
                    pathname === href2.replace("[projectId]", projectId))) &&
                  "border-b border-white cursor-pointer"
              )}
            >
              {label}
            </li>
          </Link>
        ))}

        <div className="ml-auto">
          <CopyToClipboard value={projectId} className="max-w-[200px]" />
        </div>
      </ul>
    </nav>
  );
}
