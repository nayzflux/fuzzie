import AccountDropdown from "~/components/dashboard/header/account-dropdown";
import DashboardNav from "~/components/dashboard/header/nav/dashboard-nav";

export default function DashboardHeader() {
  return (
    <header className="sticky top-0 flex items-center gap-8 px-4 sm:px-16 lg:px-32 xl:px-64 2xl:px-96 py-8 min-h-[102px]">
      {/* Breadcrumb navigation */}
      <DashboardNav />

      {/* Account */}
      <div className="ml-auto">
        <AccountDropdown />
      </div>
    </header>
  );
}
