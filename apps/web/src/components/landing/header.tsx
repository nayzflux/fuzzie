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
    <header className="sticky top-0 grid grid-cols-3 gap-16 items-center justify-between px-16 py-8 border-b bg-black bg-opacity-50 backdrop-blur-3xl z-50">
      <div className="flex justify-start">
        <Logo className="size-10" />
      </div>

      <nav>
        <ul className="flex gap-8 justify-center">
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
