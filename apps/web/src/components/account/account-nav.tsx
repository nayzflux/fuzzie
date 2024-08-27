"use client";

import { CreditCardIcon, UserCircleIcon } from "@heroicons/react/24/outline";
import { BarChartIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";

const routes = [
  {
    href: "/account",
    label: "Account",
    icon: UserCircleIcon,
  },
  {
    href: "/account/usage",
    label: "Usage",
    icon: BarChartIcon,
  },
  {
    href: "/account/subscription",
    label: "Subscription",
    icon: CreditCardIcon,
  },
];

export default function AccountNav() {
  const pathname = usePathname();

  return (
    <nav>
      <ul className="flex flex-col gap-1 min-w-[200px]">
        {routes.map(({ href, label, icon: Icon }) => (
          <li key={href}>
            <Button
              className={cn(
                "w-full justify-start",
                pathname === href && "bg-accent text-accent-foreground"
              )}
              variant="ghost"
              asChild
            >
              <Link href={href}>
                <Icon className="size-4 mr-2" />
                {label}
              </Link>
            </Button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
