"use client";

import Link from "next/link";
import {
  ArrowRightIcon,
  BusIcon,
  CalendarClockIcon,
  MapIcon,
  PlusIcon,
  RepeatIcon,
  TagIcon,
  TrendingUpIcon,
  UsersIcon,
} from "lucide-react";
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, XAxis } from "recharts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  usePlantillasSalida,
  useSalidasAdmin,
  useTours,
  useTransportes,
} from "@/hooks/use-catalogo";
import { usePromociones } from "@/hooks/use-promociones";
import type { SalidaAdminApi } from "@/lib/api";

const NOMBRES_DIAS = ["", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
const DIA_MS = 24 * 60 * 60 * 1000;

function nombreServicio(s: SalidaAdminApi) {
  return s.transporte
    ? `${s.transporte.origenNombre} → ${s.transporte.destinoNombre}`
    : (s.tour?.destinoNombre ?? "—");
}

function fechaCorta(iso: string) {
  return new Date(iso).toLocaleString("es-PE", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const configSalidasPorDia = {
  transporte: { label: "Transportes", color: "var(--chart-1)" },
  tour: { label: "Tours", color: "var(--chart-3)" },
} satisfies ChartConfig;

const configOcupacion = {
  vendidos: { label: "Vendidos", color: "var(--chart-1)" },
  libres: { label: "Libres", color: "var(--chart-5)" },
} satisfies ChartConfig;

/** KPI: cifra prominente + etiqueta sutil + icono en burbuja. */
function TarjetaKpi({
  etiqueta,
  valor,
  detalle,
  icono,
  cargando,
}: {
  etiqueta: string;
  valor: number | string;
  detalle?: string;
  icono: React.ReactNode;
  cargando?: boolean;
}) {
  return (
    <Card className="gap-2">
      <CardHeader className="flex flex-row items-center justify-between pb-0">
        <CardDescription>{etiqueta}</CardDescription>
        <span className="bg-accent text-accent-foreground flex size-8 items-center justify-center rounded-full [&_svg]:size-4">
          {icono}
        </span>
      </CardHeader>
      <CardContent>
        {cargando ? (
          <Skeleton className="h-9 w-16" />
        ) : (
          <p className="text-3xl font-semibold tracking-tight">{valor}</p>
        )}
        {detalle && (
          <p className="text-muted-foreground mt-1 text-xs">{detalle}</p>
        )}
      </CardContent>
    </Card>
  );
}

export default function PaginaResumen() {
  const transportes = useTransportes({ porPagina: 100 });
  const tours = useTours({ porPagina: 100 });
  const salidasTransporte = useSalidasAdmin({ tipo: "TRANSPORTE", porPagina: 100 });
  const salidasTour = useSalidasAdmin({ tipo: "TOUR", porPagina: 100 });
  const plantillas = usePlantillasSalida();
  const promociones = usePromociones({ porPagina: 100 });

  const ahora = Date.now();
  const esFutura = (s: SalidaAdminApi) =>
    new Date(s.fechaHoraSalida).getTime() > ahora &&
    s.estado !== "CANCELADA" &&
    s.estado !== "BORRADOR";

  const futurasTransporte = (salidasTransporte.data?.datos ?? []).filter(esFutura);
  const futurasTour = (salidasTour.data?.datos ?? []).filter(esFutura);
  const proximas = [...futurasTransporte, ...futurasTour].sort(
    (a, b) =>
      new Date(a.fechaHoraSalida).getTime() -
      new Date(b.fechaHoraSalida).getTime(),
  );
  const proximas7dias = proximas.filter(
    (s) => new Date(s.fechaHoraSalida).getTime() < ahora + 7 * DIA_MS,
  );
  const asientosVendidos = proximas.reduce((n, s) => n + s.ocupados, 0);
  const asientosTotales = proximas.reduce((n, s) => n + s.capacidad, 0);
  const horariosActivos = (plantillas.data ?? []).filter((p) => p.activo);
  const cargandoSalidas = salidasTransporte.isLoading || salidasTour.isLoading;

  // Serie: salidas por día para los próximos 14 días, separadas por tipo.
  const seriePorDia = Array.from({ length: 14 }, (_, i) => {
    const dia = new Date(ahora + i * DIA_MS);
    const clave = dia.toLocaleDateString("es-PE", {
      day: "2-digit",
      month: "short",
    });
    const delDia = (lista: SalidaAdminApi[]) =>
      lista.filter((s) => {
        const f = new Date(s.fechaHoraSalida);
        return (
          f.getDate() === dia.getDate() &&
          f.getMonth() === dia.getMonth() &&
          f.getFullYear() === dia.getFullYear()
        );
      }).length;
    return {
      dia: clave,
      transporte: delDia(futurasTransporte),
      tour: delDia(futurasTour),
    };
  });

  const datosOcupacion = [
    { nombre: "vendidos", valor: asientosVendidos, fill: "var(--chart-1)" },
    {
      nombre: "libres",
      valor: Math.max(0, asientosTotales - asientosVendidos),
      fill: "var(--chart-5)",
    },
  ];
  const porcentajeOcupacion =
    asientosTotales > 0
      ? Math.round((asientosVendidos / asientosTotales) * 100)
      : 0;

  return (
    <div className="flex w-full flex-col gap-4 p-4 lg:p-6">
      {/* Encabezado + acciones rápidas */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Resumen</h1>
          <p className="text-muted-foreground text-sm">
            Vista general de la operación de hoy.
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link href="/dashboard/transportes/nuevo">
              <PlusIcon /> Transporte
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/dashboard/tours/nuevo">
              <PlusIcon /> Tour
            </Link>
          </Button>
          <Button asChild>
            <Link href="/dashboard/salidas/nueva">
              <PlusIcon /> Programar salida
            </Link>
          </Button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <TarjetaKpi
          etiqueta="Salidas próximas (7 días)"
          valor={proximas7dias.length}
          detalle={`${proximas.length} programadas en total`}
          icono={<CalendarClockIcon />}
          cargando={cargandoSalidas}
        />
        <TarjetaKpi
          etiqueta="Asientos vendidos"
          valor={asientosVendidos}
          detalle={`de ${asientosTotales} disponibles`}
          icono={<UsersIcon />}
          cargando={cargandoSalidas}
        />
        <TarjetaKpi
          etiqueta="Rutas de transporte"
          valor={transportes.data?.total ?? transportes.data?.datos?.length ?? 0}
          detalle={`${tours.data?.total ?? tours.data?.datos?.length ?? 0} tours publicados`}
          icono={<BusIcon />}
          cargando={transportes.isLoading}
        />
        <TarjetaKpi
          etiqueta="Horarios recurrentes"
          valor={horariosActivos.length}
          detalle={`${promociones.data?.datos?.length ?? 0} promociones`}
          icono={<RepeatIcon />}
          cargando={plantillas.isLoading}
        />
      </div>

      {/* Gráficos */}
      <div className="grid gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 [&_svg]:size-4">
                <TrendingUpIcon /> Salidas por día
              </CardTitle>
              <CardDescription>Próximos 14 días, por tipo de servicio.</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            {cargandoSalidas ? (
              <Skeleton className="h-56 w-full" />
            ) : (
              <ChartContainer config={configSalidasPorDia} className="h-56 w-full">
                <BarChart data={seriePorDia}>
                  <CartesianGrid vertical={false} strokeDasharray="3 3" />
                  <XAxis
                    dataKey="dia"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    fontSize={11}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar
                    dataKey="transporte"
                    stackId="a"
                    fill="var(--color-transporte)"
                    radius={[0, 0, 4, 4]}
                  />
                  <Bar
                    dataKey="tour"
                    stackId="a"
                    fill="var(--color-tour)"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ChartContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 [&_svg]:size-4">
              <UsersIcon /> Ocupación
            </CardTitle>
            <CardDescription>Asientos en salidas futuras.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-2">
            {cargandoSalidas ? (
              <Skeleton className="h-48 w-48 rounded-full" />
            ) : (
              <div className="relative">
                <ChartContainer config={configOcupacion} className="h-52 w-52">
                  <PieChart>
                    <ChartTooltip content={<ChartTooltipContent nameKey="nombre" />} />
                    <Pie
                      data={datosOcupacion}
                      dataKey="valor"
                      nameKey="nombre"
                      innerRadius={62}
                      outerRadius={85}
                      strokeWidth={2}
                      paddingAngle={2}
                    >
                      {datosOcupacion.map((d) => (
                        <Cell key={d.nombre} fill={d.fill} />
                      ))}
                    </Pie>
                  </PieChart>
                </ChartContainer>
                <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-semibold">
                    {porcentajeOcupacion}%
                  </span>
                  <span className="text-muted-foreground text-xs">ocupado</span>
                </div>
              </div>
            )}
            <div className="text-muted-foreground flex gap-4 text-xs">
              <span className="flex items-center gap-1">
                <span className="bg-chart-1 size-2 rounded-full" /> Vendidos
              </span>
              <span className="flex items-center gap-1">
                <span className="bg-chart-5 size-2 rounded-full" /> Libres
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        {/* Próximas salidas */}
        <Card className="xl:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 [&_svg]:size-4">
                <CalendarClockIcon /> Próximas salidas
              </CardTitle>
              <CardDescription>
                Ordenadas por fecha; ocupación en vivo.
              </CardDescription>
            </div>
            <Button asChild variant="ghost" size="sm">
              <Link href="/dashboard/salidas">
                Ver todas <ArrowRightIcon />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {cargandoSalidas && <Skeleton className="h-40 w-full" />}
            {!cargandoSalidas && proximas.length === 0 && (
              <p className="text-muted-foreground py-8 text-center text-sm">
                No hay salidas futuras. Programa una desde “Programar salida”.
              </p>
            )}
            {proximas.length > 0 && (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Servicio</TableHead>
                    <TableHead>Salida</TableHead>
                    <TableHead>Ocupación</TableHead>
                    <TableHead>Estado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {proximas.slice(0, 8).map((s) => {
                    const porcentaje = Math.min(
                      100,
                      Math.round((s.ocupados / s.capacidad) * 100),
                    );
                    return (
                      <TableRow key={s.id}>
                        <TableCell className="font-medium">
                          <span className="flex items-center gap-2 [&_svg]:size-4">
                            {s.transporte ? <BusIcon /> : <MapIcon />}
                            {nombreServicio(s)}
                          </span>
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          {fechaCorta(s.fechaHoraSalida)}
                        </TableCell>
                        <TableCell className="min-w-36">
                          <div className="flex items-center gap-2">
                            <div className="bg-muted h-2 w-20 overflow-hidden rounded-full">
                              <div
                                className="bg-chart-1 h-full rounded-full"
                                style={{ width: `${porcentaje}%` }}
                              />
                            </div>
                            <span className="text-muted-foreground text-xs">
                              {s.ocupados}/{s.capacidad}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              s.estado === "CONFIRMADA" ? "default" : "secondary"
                            }
                          >
                            {s.estado.replaceAll("_", " ").toLowerCase()}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Columna lateral: horarios + accesos */}
        <div className="flex flex-col gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 [&_svg]:size-4">
                <RepeatIcon /> Horarios recurrentes
              </CardTitle>
              <CardDescription>Generación automática de salidas.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              {plantillas.isLoading && <Skeleton className="h-20 w-full" />}
              {!plantillas.isLoading && horariosActivos.length === 0 && (
                <p className="text-muted-foreground text-sm">
                  Sin horarios activos. Crea uno en “Programar salida → Horario
                  recurrente”.
                </p>
              )}
              {horariosActivos.slice(0, 5).map((p) => (
                <div
                  key={p.id}
                  className="border-border flex items-center justify-between rounded-xl border px-3 py-2"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">
                      {p.transporte
                        ? `${p.transporte.origenNombre} → ${p.transporte.destinoNombre}`
                        : (p.tour?.destinoNombre ?? "—")}
                    </p>
                    <p className="text-muted-foreground text-xs">
                      {p.diasSemana.map((d) => NOMBRES_DIAS[d]).join(" · ")} —{" "}
                      {p.horaSalida}
                    </p>
                  </div>
                  <Badge className="shrink-0" variant="secondary">
                    S/ {p.precioPen}
                  </Badge>
                </div>
              ))}
              {horariosActivos.length > 0 && (
                <Button asChild variant="ghost" size="sm" className="self-end">
                  <Link href="/dashboard/salidas">
                    Gestionar <ArrowRightIcon />
                  </Link>
                </Button>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Accesos rápidos</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-2">
              {[
                { titulo: "Transportes", href: "/dashboard/transportes", icono: <BusIcon /> },
                { titulo: "Tours", href: "/dashboard/tours", icono: <MapIcon /> },
                { titulo: "Promociones", href: "/dashboard/promociones", icono: <TagIcon /> },
                { titulo: "Usuarios", href: "/dashboard/usuarios", icono: <UsersIcon /> },
              ].map((a) => (
                <Button
                  key={a.href}
                  asChild
                  variant="outline"
                  className="h-auto justify-start gap-2 py-3"
                >
                  <Link href={a.href}>
                    <span className="bg-accent text-accent-foreground flex size-7 items-center justify-center rounded-full [&_svg]:size-4">
                      {a.icono}
                    </span>
                    {a.titulo}
                  </Link>
                </Button>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
