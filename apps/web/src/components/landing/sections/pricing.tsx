import plans from "~/data/plans.json";
import { PricingCard } from "../pricing/pricing-card";
import LandingSection from "./landing-section";
import SectionTitle from "./section-title";

export default function Pricing() {
  return (
    <LandingSection>
      <SectionTitle
        title="Start for free pay as you scale."
        subtitle="Simple and transparent pricing"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 z-10" id="pricing">
        {plans.map((plan) => (
          <PricingCard key={plan.title} {...plan} />
        ))}
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
