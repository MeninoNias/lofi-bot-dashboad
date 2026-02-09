import { Outlet } from "react-router";

import { AppSidebar } from "@/components/app-sidebar";

export function DashboardLayout() {
  return (
    <div className="flex min-h-screen">
      <AppSidebar />
      <main className="flex-1 ml-64 p-8">
        <Outlet />
      </main>
    </div>
  );
}
