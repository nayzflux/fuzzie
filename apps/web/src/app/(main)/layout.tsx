import { ReactNode } from "react";
import { Footer } from "~/components/landing/footer";
import Header from "~/components/landing/header";

export default function LandingLayout({ children }: { children: ReactNode }) {
  return (
    <div>
      <Header />
      {children}
      <Footer />
    </div>
  );
}
