import { ReactNode } from "react";
import AccountNav from "~/components/account/account-nav";

export default function AccountLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex gap-16 px-4 sm:px-16 lg:px-32 xl:px-64 2xl:px-96 py-4 sm:py-16 border-t">
      {/* Account navigation */}
      <AccountNav />

      {/* Account page */}
      {children}
    </div>
  );
}
