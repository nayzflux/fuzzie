import { ArrowRightIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import AnimatedGridPattern from "~/components/magicui/animated-grid-pattern";
import AnimatedShinyText from "~/components/magicui/animated-shiny-text";
import { Heading } from "~/components/paragraphs/heading";
import { cn } from "~/lib/utils";
import { Button } from "../../ui/button";
import LandingSection from "./landing-section";

export default function Hero() {
  return (
    <LandingSection>
      <div className="flex flex-col gap-8 sm:gap-16 text-center items-center">
        {/* Badge */}
        <Link href="/app">
          <div className="z-10 flex items-center justify-center">
            <div className="group rounded-full border border-black/5 bg-neutral-100 text-base text-white transition-all ease-in hover:cursor-pointer hover:bg-neutral-200 dark:border-white/5 dark:bg-neutral-900 dark:hover:bg-neutral-800">
              <AnimatedShinyText className="inline-flex items-center justify-center px-4 py-1 transition ease-out hover:text-neutral-600 hover:duration-300 hover:dark:text-neutral-400">
                <span>✨ Fuzzie available in Beta</span>
                <ArrowRightIcon className="ml-1 size-3 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
              </AnimatedShinyText>
            </div>
          </div>
        </Link>

        <Heading as="h1">Deliver fast, secure and reliable webhooks.</Heading>

        <p className="text-sm sm:text-xl text-muted-foreground max-w-[800px]">
          {/* Fuzzie is an open-source webhook delivery platform designed to
          simplify and secure webhook interactions between both internal
          services and customer&apos;s applications. */}
          Fuzzie is an open-source platform that transforms the way you deliver
          webhooks. Making interactions between your services and customer
          applications easy, reliable and secure.
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
