import { ReactNode } from "react";
import SettingsNav from "./settings-nav";

export default function SettingsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex gap-16">
      <SettingsNav />

      {children}
    </div>
  );
}
