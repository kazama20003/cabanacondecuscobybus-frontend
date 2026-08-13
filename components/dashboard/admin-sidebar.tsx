"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BusIcon,
  CalendarClockIcon,
  CreditCardIcon,
  ImageIcon,
  LayoutDashboardIcon,
  MapIcon,
  MountainIcon,
  TicketIcon,
  UsersIcon,
} from "lucide-react";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useMiPerfil } from "@/hooks/use-auth";
import { avatarStorage } from "@/lib/api";

const navegacion = [
  {
    etiqueta: "General",
    items: [
      { titulo: "Resumen", url: "/dashboard", icono: <LayoutDashboardIcon /> },
    ],
  },
  {
    etiqueta: "Catálogo",
    items: [
      { titulo: "Transportes", url: "/dashboard/transportes", icono: <BusIcon /> },
      { titulo: "Tours", url: "/dashboard/tours", icono: <MapIcon /> },
      { titulo: "Salidas", url: "/dashboard/salidas", icono: <CalendarClockIcon /> },
      { titulo: "Imágenes", url: "/dashboard/imagenes", icono: <ImageIcon /> },
    ],
  },
  {
    etiqueta: "Operación",
    items: [
      { titulo: "Reservas", url: "/dashboard/reservas", icono: <TicketIcon /> },
      { titulo: "Pagos", url: "/dashboard/pagos", icono: <CreditCardIcon /> },
    ],
  },
  {
    etiqueta: "Administración",
    items: [
      { titulo: "Usuarios", url: "/dashboard/usuarios", icono: <UsersIcon /> },
    ],
  },
];

export function AdminSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const { data: perfil } = useMiPerfil();
  const [avatar, setAvatar] = React.useState("");
  React.useEffect(() => setAvatar(avatarStorage.obtener()), []);

  const usuario = {
    name: perfil ? `${perfil.nombres} ${perfil.apellidos}`.trim() : "Administrador",
    email: perfil?.correo ?? "",
    avatar,
  };

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5!"
            >
              <Link href="/dashboard">
                <MountainIcon className="size-5!" />
                <span className="text-base font-semibold">Inca Travel Peru</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {navegacion.map((grupo) => (
          <SidebarGroup key={grupo.etiqueta}>
            <SidebarGroupLabel>{grupo.etiqueta}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {grupo.items.map((item) => (
                  <SidebarMenuItem key={item.url}>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === item.url}
                      tooltip={item.titulo}
                    >
                      <Link href={item.url}>
                        {item.icono}
                        <span>{item.titulo}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={usuario} />
      </SidebarFooter>
    </Sidebar>
  );
}
