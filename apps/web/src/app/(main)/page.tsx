import CTA from "~/components/landing/sections/cta";
import Demo from "~/components/landing/sections/demo";
import Hero from "~/components/landing/sections/hero";
import Pricing from "~/components/landing/sections/pricing";
import Problem from "~/components/landing/sections/problem";
import Product from "~/components/landing/sections/product";
import Testimonial from "~/components/landing/sections/testimonial";

export default function LandingPage() {
  return (
    <main>
      <Hero />

      <Problem />

      <Product />

      <Demo />

      <Testimonial />

      <Pricing />

      <CTA />
    </main>
  );
}
