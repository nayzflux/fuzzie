import { ArrowRightIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import LandingSection from "./landing-section";
import SectionTitle from "./section-title";
import Particles from "~/components/magicui/particles";

export default function CTA() {
  return (
    <LandingSection>
      <SectionTitle
        title="Setup webhooks in seconds."
        subtitle="Take control of your webhooks"
      />

      <Particles
        className="absolute inset-0"
        quantity={100}
        ease={80}
        refresh
      />

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
    </LandingSection>
  );
}
