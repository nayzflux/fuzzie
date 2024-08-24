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
  const div5Ref = useRef<HTMLDivElement>(null);

  return (
    <div className="absolute h-full w-full transition-all duration-300 ease-out [mask-image:linear-gradient(to_top,transparent_10%,#000_100%)] group-hover:scale-105">
      <div className="p-16">
        <div
          className="relative flex w-full items-center justify-center overflow-hidden"
          ref={containerRef}
        >
          <div className="flex size-full max-w-lg flex-row items-stretch justify-between gap-10">
            <div className="flex flex-row items-center justify-between w-full gap-8">
              <Circle ref={div1Ref}>
                <ServerStackIcon className="size-12 text-black" />
              </Circle>

              <div ref={div2Ref} className="z-30">
                <Logo width={48} height={48} />
              </div>

              <div className="grid grid-cols-1 grid-rows-3 gap-4">
                <Circle ref={div3Ref}>
                  <UserIcon className="size-12 text-black" />
                </Circle>

                <Circle ref={div4Ref}>
                  <UserIcon className="size-12 text-black" />
                </Circle>

                <Circle ref={div5Ref}>
                  <UserIcon className="size-12 text-black" />
                </Circle>
              </div>
            </div>
          </div>

          <AnimatedBeam
            duration={2}
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

          <AnimatedBeam
            duration={2}
            containerRef={containerRef}
            fromRef={div2Ref}
            toRef={div5Ref}
          />
        </div>
      </div>
    </div>
  );
};
