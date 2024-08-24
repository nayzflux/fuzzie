import Particles from "~/components/magicui/particles";
import { PricingCard } from "../pricing/pricing-card";
import LandingSection from "./landing-section";
import SectionTitle from "./section-title";

const plans = [
  {
    title: "Free Tier",
    description: "Everything you need to start.",
    price: 0,
    cta: "Start for Free",
    features: [
      "1k events triggered / month",
      "5k webhooks delivered / month",
      "7-days logs retention",
      "Unlimited projects",
    ],
  },
  {
    title: "Pro Tier",
    description: "Don't get limited by Free Tier.",
    price: 25,
    cta: "Start with Pro",
    features: [
      "10k events triggered / month",
      "50k webhooks delivered / month",
      "90-days logs retention",
      "Unlimited projects",
    ],
    isPrimary: true,
  },
];

export default function Pricing() {
  return (
    <LandingSection>
      <SectionTitle
        title="Start for free pay as you scale."
        subtitle="Simple and transparent pricing"
      />

      <Particles
        className="absolute inset-0"
        quantity={100}
        ease={80}
        refresh
      />

      <div className="grid grid-cols-2 gap-32">
        {plans.map((plan) => (
          <PricingCard key={plan.title} {...plan} />
        ))}
      </div>
    </LandingSection>
  );
}
