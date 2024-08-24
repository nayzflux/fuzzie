"use client";

import { ServerStackIcon, UserIcon } from "@heroicons/react/24/outline";
import { forwardRef, useRef } from "react";
import Logo from "~/components/logo";
import { AnimatedBeam } from "~/components/magicui/animated-beam";
import { cn } from "~/lib/utils";

const Circle = forwardRef<
  HTMLDivElement,
  { className?: string; children?: React.ReactNode }
>(({ className, children }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "z-10 flex size-12 items-center justify-center rounded-full border-2 bg-white p-3 shadow-[0_0_20px_-12px_rgba(0,0,0,0.8)]",
        className
      )}
    >
      {children}
    </div>
  );
});

export const Trigger = ({ className }: { className?: string }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const div1Ref = useRef<HTMLDivElement>(null);
  const div2Ref = useRef<HTMLDivElement>(null);
  const div3Ref = useRef<HTMLDivElement>(null);
  const div4Ref = useRef<HTMLDivElement>(null);

  return (
    <div
      className={cn(
        "relative flex h-[500px] w-full items-center justify-center overflow-hidden rounded-lg border bg-background p-10 md:shadow-xl",
        className
      )}
      ref={containerRef}
    >
      <div className="flex size-full max-w-lg flex-row items-stretch justify-between gap-10">
        <div className="flex flex-col justify-center">
          <Circle ref={div1Ref}>
            <ServerStackIcon className="size-6" />
          </Circle>
        </div>

        <div className="flex flex-col justify-center">
          <div ref={div2Ref}>
            <Logo className="z-50 size-16" />
          </div>
        </div>

        <div className="flex flex-col justify-center gap-2">
          <Circle ref={div3Ref}>
            <UserIcon className="size-6" />
          </Circle>

          <Circle ref={div4Ref}>
            <UserIcon className="size-6" />
          </Circle>
        </div>
      </div>

      <AnimatedBeam
        duration={3}
        containerRef={containerRef}
        fromRef={div1Ref}
        toRef={div2Ref}
      />

      <AnimatedBeam
        duration={2}
        containerRef={containerRef}
        fromRef={div2Ref}
        toRef={div3Ref}
      />

      <AnimatedBeam
        duration={2}
        containerRef={containerRef}
        fromRef={div2Ref}
        toRef={div4Ref}
      />
    </div>
  );
};
