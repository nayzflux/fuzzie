import { ReactNode } from "react";
import VerifyEmailBanner from "~/components/banner/verify-email-banner";
import DashboardHeader from "~/components/dashboard/header/dashboard-header";

export default function AuthenticatedLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col">
      {/* Header */}
      <DashboardHeader />

      {children}

      {/* Verify email banner */}
      <VerifyEmailBanner />
    </div>
  );
}
