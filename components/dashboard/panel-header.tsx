"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { HomeIcon } from "lucide-react";
import { BotonTema } from "@/components/dashboard/boton-tema";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";

/** Etiqueta legible por cada segmento conocido de la ruta. */
const ETIQUETAS: Record<string, string> = {
  transportes: "Transportes",
  tours: "Tours",
  salidas: "Salidas",
  promociones: "Promociones",
  imagenes: "Imágenes",
  reservas: "Reservas",
  pagos: "Pagos",
  usuarios: "Usuarios",
  auditoria: "Auditoría",
  nuevo: "Nuevo",
  nueva: "Nueva",
  editar: "Editar",
  itinerario: "Itinerario",
  traducciones: "Traducciones",
  paradas: "Paradas",
};

interface Miga {
  etiqueta: string;
  href: string;
  /** Solo los segmentos conocidos tienen una página propia navegable. */
  navegable: boolean;
  /** Los slugs (segmentos dinámicos) se truncan y no se capitalizan raro. */
  esSlug: boolean;
}

function construirMigas(pathname: string): Miga[] {
  const segmentos = pathname.split("/").filter(Boolean).slice(1); // sin "dashboard"
  const migas: Miga[] = [];
  let acumulado = "/dashboard";
  for (const segmento of segmentos) {
    acumulado += `/${segmento}`;
    const conocido = segmento in ETIQUETAS;
    migas.push({
      etiqueta: conocido
        ? ETIQUETAS[segmento]
        : decodeURIComponent(segmento).replace(/-/g, " "),
      href: acumulado,
      navegable: conocido,
      esSlug: !conocido,
    });
  }
  return migas;
}

export function PanelHeader() {
  const pathname = usePathname();
  const migas = construirMigas(pathname);
  const enResumen = migas.length === 0;

  return (
    <header className="bg-background/80 sticky top-0 z-20 flex h-(--header-height) shrink-0 items-center gap-2 border-b backdrop-blur transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height) md:rounded-t-2xl">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <Breadcrumb>
          <BreadcrumbList>
            {/* Inicio del panel: siempre visible, con icono. */}
            <BreadcrumbItem>
              {enResumen ? (
                <BreadcrumbPage className="flex items-center gap-1.5 font-medium">
                  <HomeIcon className="size-3.5" />
                  Resumen
                </BreadcrumbPage>
              ) : (
                <BreadcrumbLink asChild>
                  <Link
                    href="/dashboard"
                    className="hover:text-foreground flex items-center gap-1.5"
                  >
                    <HomeIcon className="size-3.5" />
                    <span className="hidden sm:inline">Panel</span>
                  </Link>
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>

            {migas.map((miga, indice) => {
              const esUltima = indice === migas.length - 1;
              const enlazar = !esUltima && miga.navegable;
              // En pantallas chicas solo se muestran inicio y la página actual.
              const ocultarEnMovil = !esUltima ? "hidden md:flex" : "";
              return (
                <div key={miga.href} className="contents">
                  <BreadcrumbSeparator className={ocultarEnMovil} />
                  <BreadcrumbItem className={ocultarEnMovil}>
                    {enlazar ? (
                      <BreadcrumbLink asChild>
                        <Link
                          href={miga.href}
                          className="hover:text-foreground max-w-40 truncate"
                        >
                          {miga.etiqueta}
                        </Link>
                      </BreadcrumbLink>
                    ) : esUltima ? (
                      <BreadcrumbPage
                        className={`max-w-52 truncate font-medium ${
                          miga.esSlug ? "capitalize" : ""
                        }`}
                      >
                        {miga.etiqueta}
                      </BreadcrumbPage>
                    ) : (
                      <span
                        className={`text-muted-foreground max-w-40 truncate ${
                          miga.esSlug ? "capitalize" : ""
                        }`}
                      >
                        {miga.etiqueta}
                      </span>
                    )}
                  </BreadcrumbItem>
                </div>
              );
            })}
          </BreadcrumbList>
        </Breadcrumb>
        <div className="ml-auto flex items-center gap-2">
          <BotonTema />
        </div>
      </div>
    </header>
  );
}
