"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BusIcon,
  CalendarClockIcon,
  CreditCardIcon,
  ImageIcon,
  TagIcon,
  LayoutDashboardIcon,
  MapIcon,
  TicketIcon,
  UsersIcon,
} from "lucide-react";
import { NavUser } from "@/components/nav-user";
import LangSwitcher from "@/components/lang-switcher";
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
import { LOGO_URL } from "@/lib/data";

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
      { titulo: "Promociones", url: "/dashboard/promociones", icono: <TagIcon /> },
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
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={LOGO_URL} alt="" className="size-6! rounded-md object-contain" />
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
        <div className="px-2 pb-1">
          <LangSwitcher direction="up" align="left" />
        </div>
        <NavUser user={usuario} />
      </SidebarFooter>
    </Sidebar>
  );
}
