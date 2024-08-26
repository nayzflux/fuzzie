import { ReactNode } from "react";
import { cn } from "~/lib/utils";

export const Heading = ({
  children,
  className,
  as: As = "h1",
}: {
  children: ReactNode;
  className?: string;
  as: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
}) => {
  return (
    <As
      className={cn(
        "text-3xl sm:text-5xl font-extrabold max-w-[320px] sm:max-w-[500px] text-transparent bg-clip-text bg-gradient-to-b from-zinc-300 to-zinc-600",
        className
      )}
    >
      {children}
    </As>
  );
};
