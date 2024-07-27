"use client";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";

const routes = [
  {
    href: "/app/[projectId]/settings",
    label: "Manage project",
  },
  {
    href: "/app/[projectId]/settings/keys",
    label: "API keys",
  },
];

export default function SettingsNav() {
  const { projectId } = useParams() as { projectId: string };
  const pathname = usePathname();

  return (
    <nav>
      <ul className="flex flex-col gap-1 min-w-[200px]">
        {routes.map(({ href, label }) => (
          <li key={label}>
            <Button
              className={cn(
                "w-full justify-start",
                pathname === href.replace("[projectId]", projectId) &&
                  "bg-accent text-accent-foreground"
              )}
              variant="ghost"
              asChild
            >
              <Link href={href.replace("[projectId]", projectId)}>{label}</Link>
            </Button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
