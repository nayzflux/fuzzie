import { ReactNode } from "react";
import Header from "~/components/landing/header";

export default function LandingLayout({ children }: { children: ReactNode }) {
  return (
    <div>
      <Header />
      {children}
    </div>
  );
}
