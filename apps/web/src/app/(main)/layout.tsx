import { ReactNode } from "react";
import Header from "~/components/landing/header";

export default function LandingLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen w-screen">
      <Header />
      {children}
    </div>
  );
}
