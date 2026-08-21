"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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
  dashboard: "Resumen",
  transportes: "Transportes",
  tours: "Tours",
  salidas: "Salidas",
  promociones: "Promociones",
  imagenes: "Imágenes",
  reservas: "Reservas",
  pagos: "Pagos",
  usuarios: "Usuarios",
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
}

function construirMigas(pathname: string): Miga[] {
  const segmentos = pathname.split("/").filter(Boolean);
  const migas: Miga[] = [];
  let acumulado = "";
  for (const segmento of segmentos) {
    acumulado += `/${segmento}`;
    const conocido = segmento in ETIQUETAS;
    const etiqueta = conocido
      ? ETIQUETAS[segmento]
      : decodeURIComponent(segmento).replace(/-/g, " ");
    migas.push({ etiqueta, href: acumulado, navegable: conocido });
  }
  return migas;
}

export function PanelHeader() {
  const pathname = usePathname();
  const migas = construirMigas(pathname);

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <Breadcrumb>
          <BreadcrumbList>
            {migas.map((miga, indice) => {
              const esUltima = indice === migas.length - 1;
              const enlazar = !esUltima && miga.navegable;
              return (
                <div key={miga.href} className="contents">
                  <BreadcrumbItem>
                    {enlazar ? (
                      <BreadcrumbLink asChild className="capitalize">
                        <Link href={miga.href}>{miga.etiqueta}</Link>
                      </BreadcrumbLink>
                    ) : (
                      <BreadcrumbPage
                        className={
                          esUltima
                            ? "font-medium capitalize"
                            : "capitalize text-muted-foreground"
                        }
                      >
                        {miga.etiqueta}
                      </BreadcrumbPage>
                    )}
                  </BreadcrumbItem>
                  {!esUltima && <BreadcrumbSeparator />}
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
