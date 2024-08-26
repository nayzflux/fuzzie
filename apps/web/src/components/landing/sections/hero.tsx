import { ArrowRightIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import AnimatedGridPattern from "~/components/magicui/animated-grid-pattern";
import { Heading } from "~/components/paragraphs/heading";
import { cn } from "~/lib/utils";
import { Button } from "../../ui/button";
import LandingSection from "./landing-section";

export default function Hero() {
  return (
    <LandingSection>
      <div className="flex flex-col gap-8 sm:gap-16 text-center items-center">
        <Heading as="h1">Deliver fast, secure and reliable webhooks.</Heading>

        <p className="text-sm sm:text-xl text-muted-foreground max-w-[800px]">
          Fuzzie is an open-source webhook delivery platform designed to
          simplify and secure webhook interactions between both internal
          services and customer&apos;s applications.
        </p>
      </div>

      <div className="flex justify-center items-center gap-8">
        <Button
          size="lg"
          className="bg-violet-700 hover:bg-violet-900 transition-all ease-out duration-500 text-white"
          asChild
        >
          <Link href="/app">
            Get Started
            <ArrowRightIcon className="size-4 ml-2" />
          </Link>
        </Button>

        <Button variant="link" asChild>
          <Link href="/docs">Read docs</Link>
        </Button>
      </div>

      <AnimatedGridPattern
        numSquares={30}
        maxOpacity={0.1}
        duration={3}
        repeatDelay={1}
        className={cn(
          "[mask-image:radial-gradient(500px_circle_at_center,white,transparent)]",
          "inset-x-0 inset-y-[-80%] h-[250%] skew-y-12 -z-10"
        )}
      />
    </LandingSection>
  );
}
