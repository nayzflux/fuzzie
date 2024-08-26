import { ArrowRightIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import Particles from "~/components/magicui/particles";
import { Heading } from "~/components/paragraphs/heading";
import { Button } from "~/components/ui/button";
import LandingSection from "./landing-section";
import SectionTitle from "./section-title";

export default function CTA() {
  return (
    <LandingSection>
      <SectionTitle
        title="Setup webhooks in seconds."
        subtitle="Take control of your webhooks"
        className="flex lg:hidden"
      />

      <div className="flex items-center gap-16 xl:gap-32">
        <div className="hidden lg:flex flex-col gap-4">
          <p className="text-muted-foreground">Take control of your webhooks</p>

          <Heading as="h1">Setup webhooks in seconds.</Heading>
        </div>

        <div className="flex items-center gap-8">
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

          <Button size="lg" variant="link" asChild>
            <Link href="/docs">Read docs</Link>
          </Button>
        </div>
      </div>

      <Particles
        className="absolute inset-0 -z-10"
        quantity={200}
        ease={80}
        refresh
      />
    </LandingSection>
  );
}
