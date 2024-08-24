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

      <Features />
    </LandingSection>
  );
}
