import { ReactNode } from "react";
import { cn } from "~/lib/utils";

export default function LandingSection({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "relative flex flex-col w-full jusitfy-center items-center px-4 sm:px-16 lg:px-32 xl:px-64 2xl:px-96 py-16 sm:py-32 gap-8 sm:gap-16",
        className
      )}
    >
      {children}
    </section>
  );
}
