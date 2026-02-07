import { Outlet } from "react-router";

import { AppSidebar } from "@/components/app-sidebar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useAuthStore } from "@/stores/auth-store";

export function DashboardLayout() {
  const apiKey = useAuthStore((state) => state.apiKey);

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <div className="flex flex-1 items-center justify-between">
            <span className="text-sm font-medium">Lofi Bot Dashboard</span>
            {apiKey ? (
              <Badge
                variant="outline"
                className="border-emerald-500/50 text-emerald-400"
              >
                <span className="mr-1.5 inline-block size-2 rounded-full bg-emerald-500 animate-pulse" />
                Connected
              </Badge>
            ) : (
              <Badge variant="outline" className="text-muted-foreground">
                Disconnected
              </Badge>
            )}
          </div>
        </header>
        <div className="flex-1 p-6">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
