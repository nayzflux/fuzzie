import { ReactNode } from "react";
import Consent from "~/components/auth/consent";
import SocialAuth from "~/components/auth/social-auth";
import Particles from "~/components/magicui/particles";
import { Separator } from "~/components/ui/separator";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 h-screen">
      {/* Left */}
      <div className="flex flex-col items-center justify-center">
        <main className="flex flex-col gap-8 w-[300px] md:w-[475px] mb-32">
          {children}

          {/* Separator */}
          <div className="grid grid-cols-3 items-center gap-4">
            <Separator className="col-span-1" />

            <p className="text-center text-sm text-muted-foreground">
              Or continue with
            </p>

            <Separator className="col-span-1" />
          </div>

          {/* Social Auth */}
          <SocialAuth />

          {/* Consent */}
          <Consent />
        </main>
      </div>

      {/* Right */}
      <div className="relative hidden lg:flex">
        <Particles quantity={200} />
      </div>
    </div>
  );
}
