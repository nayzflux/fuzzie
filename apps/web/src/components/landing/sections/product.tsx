import Particles from "~/components/magicui/particles";
import Features from "../features/features";
import LandingSection from "./landing-section";
import SectionTitle from "./section-title";

export default function Product() {
  return (
    <LandingSection>
      <SectionTitle
        title="Webhooks with superpowers."
        subtitle="Discover Fuzzie"
      />

      <Particles
        className="absolute inset-0"
        quantity={100}
        ease={80}
        refresh
      />

      <Features />
    </LandingSection>
  );
}
