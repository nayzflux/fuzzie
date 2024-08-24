import { Card } from "~/components/ui/card";
import LandingSection from "./landing-section";
import SectionTitle from "./section-title";
import Particles from "~/components/magicui/particles";

export default function Demo() {
  return (
    <LandingSection>
      <SectionTitle
        title="The easiest way to send webhooks."
        subtitle="Seamless integration"
      />

      <Particles
        className="absolute inset-0"
        quantity={100}
        ease={80}
        refresh
      />

      <Card className="p-6 w-full">
        <div className="aspect-video w-full">
          <iframe
            className="w-full h-full rounded-lg"
            src="https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?si=J_ybAeGBEvc3X-vc"
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          ></iframe>
        </div>
      </Card>
    </LandingSection>
  );
}
