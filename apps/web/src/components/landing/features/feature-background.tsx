import { ReactNode } from "react";

export const FeatureBackgrond = ({ children }: { children: ReactNode }) => {
  return (
    <div className="absolute h-full w-full transition-all duration-300 ease-out [mask-image:linear-gradient(to_top,transparent_10%,#000_100%)] group-hover:scale-105">
      <div className="p-8 sm:p-16">{children}</div>
    </div>
  );
};
