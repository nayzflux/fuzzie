import { CheckIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { Heading } from "~/components/paragraphs/heading";
import LandingSection from "./landing-section";
import SectionTitle from "./section-title";

const benefits = [
  "Easy to setup",
  "Ensure deliverability",
  "Robust retry system",
  "Fast and secure",
  "Replay event",
  "Built-in analytics",
];

const problems = [
  "Bad reliability",
  "Retry is hard",
  "Security is difficult",
  "No observability",
];

export default function Problem() {
  return (
    <LandingSection className="bg-gradient-to-b from-transparent via-background to-background">
      <SectionTitle
        title="Let us handle the intricate work."
        subtitle="Webhooks can be painful"
        className="flex lg:hidden"
      />

      <div className="flex items-center gap-16 xl:gap-32">
        <div className="hidden lg:flex flex-col gap-4">
          <p className="text-muted-foreground">Focus on what matters most</p>

          <Heading as="h1">Let us handle the intricate work.</Heading>
        </div>

        <div className="flex gap-8 lg:gap-16">
          <div className="flex flex-col gap-4">
            <p className="text-base md:text-lg text-muted-foreground">
              Without Fuzzie
            </p>

            <ul className="flex flex-col gap-2">
              {problems.map((problem) => (
                <li
                  key={problem}
                  className="text-sm md:text-base flex items-center gap-2 text-red-600"
                >
                  <XMarkIcon className="size-4" />
                  <p>{problem}</p>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-4">
            <p className="text-base md:text-lg text-muted-foreground">
              With Fuzzie
            </p>

            <ul className="text-sm md:text-base flex flex-col gap-2">
              {benefits.map((benefit) => (
                <li
                  key={benefit}
                  className="flex items-center gap-2 text-green-600"
                >
                  <CheckIcon className="size-4" />
                  <p>{benefit}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* <Particles
        className="absolute inset-0"
        quantity={100}
        ease={80}
        refresh
      /> */}
    </LandingSection>
  );
}
