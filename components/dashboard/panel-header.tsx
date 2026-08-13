"use client";

import { usePathname } from "next/navigation";
import { BotonTema } from "@/components/dashboard/boton-tema";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";

const titulos: Record<string, string> = {
  "/dashboard": "Resumen",
  "/dashboard/transportes/nuevo": "Nueva ruta",
  "/dashboard/transportes": "Transportes",
  "/dashboard/tours/nuevo": "Nuevo tour",
  "/dashboard/tours": "Tours",
  "/dashboard/salidas/nueva": "Nueva salida",
  "/dashboard/salidas": "Salidas programadas",
  "/dashboard/imagenes": "Imágenes",
  "/dashboard/reservas": "Reservas",
  "/dashboard/pagos": "Pagos",
  "/dashboard/usuarios": "Usuarios",
  "/dashboard/promociones/nueva": "Nueva promoción",
  "/dashboard/promociones": "Promociones",
};

export function PanelHeader() {
  const pathname = usePathname();
  const titulo =
    titulos[pathname] ??
    (pathname.endsWith("/paradas")
      ? "Paradas de la ruta"
      : Object.entries(titulos).find(([ruta]) =>
          pathname.startsWith(`${ruta}/`),
        )?.[1] ?? "Panel de administración");

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <h1 className="text-base font-medium">{titulo}</h1>
        <div className="ml-auto flex items-center gap-2">
          <BotonTema />
        </div>
      </div>
    </header>
  );
}
