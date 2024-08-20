import { Card } from "~/components/ui/card";
import LandingSection from "./landing-section";
import SectionTitle from "./section-title";

export default function Demo() {
  return (
    <LandingSection>
      <SectionTitle
        title="The easiest way to send webhooks."
        subtitle="Seamless integration"
      />

      <Card className="p-6">
        <div className="aspect-video">
          <iframe className="w-full h-full" src="https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?si=J_ybAeGBEvc3X-vc" title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen></iframe>
        </div>
      </Card>
    </LandingSection>
  );
}
