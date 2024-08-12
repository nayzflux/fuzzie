import { ArrowRightIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { Button } from "../../ui/button";
import LandingSection from "./landing-section";

export default function Hero() {
  return (
    <LandingSection>
      <div className="flex flex-col gap-16 text-center items-center">
        <h1 className="text-5xl font-extrabold max-w-[600px] text-transparent bg-clip-text bg-gradient-to-b from-zinc-300 to-zinc-600">
          Deliver fast, secure and reliable webhooks.
        </h1>

        <p className="text-lg text-muted-foreground max-w-[800px]">
          Fuzzie is an open-source webhook delivery platform designed to
          simplify and secure webhook interactions between both internal
          services and customer&apos;s applications.
        </p>
      </div>

      <div className="flex justify-center items-center gap-8">
        <Button size="lg" asChild>
          <Link href="/app">
            Get Started
            <ArrowRightIcon className="size-4 ml-2" />
          </Link>
        </Button>

        <Button variant="link" asChild>
          <Link href="/docs">Read docs</Link>
        </Button>
      </div>
    </LandingSection>
  );
}
