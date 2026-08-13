import { AdminSidebar } from "@/components/dashboard/admin-sidebar";
import { GuardiaPanel } from "@/components/dashboard/guardia-panel";
import { PanelHeader } from "@/components/dashboard/panel-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AdminSidebar variant="inset" />
      <SidebarInset>
        <PanelHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <GuardiaPanel>{children}</GuardiaPanel>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
