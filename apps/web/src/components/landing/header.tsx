import Link from "next/link";
import Logo from "~/components/logo";
import { Button } from "../ui/button";

const routes = [
  {
    label: "Product",
    href: "#product",
  },
  {
    label: "Pricing",
    href: "#pricing",
  },
  {
    label: "Docs",
    href: "/docs",
  },
];

export default function Header() {
  return (
    <header className="sticky top-0 flex gap-16 items-center justify-between px-16 py-8 border-b">
      <Logo className="size-10" />

      <nav>
        <ul className="flex gap-8">
          {routes.map(({ label, href }) => (
            <Button key={label} variant="link" asChild>
              <Link href={href}>{label}</Link>
            </Button>
          ))}
        </ul>
      </nav>

      <Button asChild>
        <Link href="/app">Get Started</Link>
      </Button>
    </header>
  );
}
