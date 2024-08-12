import { ReactNode } from "react";

export default function LandingSection({ children }: { children: ReactNode }) {
  return (
    <section className="flex flex-col w-full jusitfy-center items-center py-32 px-32 gap-16">
      {children}
    </section>
  );
}
