import Link from "next/link";
import Logo from "~/components/logo";
import { Button } from "~/components/ui/button";

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
    <header className="sticky top-0 grid grid-cols-3 items-center justify-between px-4 sm:px-16 lg:px-32 xl:px-64 2xl:px-96 py-2 sm:py-8 gap-8 sm:gap-16 border-b bg-opacity-50 backdrop-blur-3xl z-50">
      <div className="flex justify-start">
        <Logo className="size-10" />
      </div>

      <nav>
        <ul className="hidden sm:flex gap-8 justify-center">
          {routes.map(({ label, href }) => (
            <Button key={label} variant="link" asChild>
              <Link href={href}>{label}</Link>
            </Button>
          ))}
        </ul>
      </nav>

      <div className="flex justify-end">
        <Button asChild>
          <Link href="/app">Get Started</Link>
        </Button>
      </div>
    </header>
  );
}
