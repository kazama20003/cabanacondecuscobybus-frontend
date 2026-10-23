"use client";

import { useState, type FormEvent } from "react";
import {
  ArrowDownLeftIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  CalendarClockIcon,
  CheckCircle2Icon,
  CircleDollarSignIcon,
  CreditCardIcon,
  FileSearchIcon,
  LoaderCircleIcon,
  RefreshCwIcon,
  SearchIcon,
  ShieldCheckIcon,
  WalletCardsIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useConfirmarPago, usePagosAdministracion } from "@/hooks/use-pagos";
import type { EstadoPago, MetodoPago, PagoAdminApi } from "@/lib/api";

const POR_PAGINA = 15;

const nombresMetodo: Record<MetodoPago, string> = {
  IZIPAY: "Izipay",
  TRANSFERENCIA: "Transferencia",
  EFECTIVO_OFICINA: "Efectivo en oficina",
};

const nombresEstado: Record<EstadoPago, string> = {
  PENDIENTE: "Pendiente",
  APROBADO: "Aprobado",
  RECHAZADO: "Rechazado",
  REEMBOLSADO: "Reembolsado",
};

function formatearMonto(pago: PagoAdminApi) {
  return new Intl.NumberFormat("es-PE", {
    style: "currency",
    currency: pago.moneda === "USD" ? "USD" : "PEN",
  }).format(Number(pago.monto));
}

function formatearFecha(fecha: string) {
  return new Intl.DateTimeFormat("es-PE", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(fecha));
}

function EstadoPagoBadge({ pago }: { pago: PagoAdminApi }) {
  const esIzipayPendiente =
    pago.metodo === "IZIPAY" && pago.estado === "PENDIENTE";
  const texto = esIzipayPendiente
    ? "Esperando IPN"
    : pago.metodo === "IZIPAY" && pago.estado === "APROBADO"
      ? "IPN confirmado"
      : nombresEstado[pago.estado];
  const color =
    pago.estado === "APROBADO"
      ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300"
      : pago.estado === "RECHAZADO"
        ? "border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300"
        : pago.estado === "PENDIENTE"
          ? "border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-300"
          : "border-border bg-muted text-muted-foreground";

  return (
    <Badge variant="outline" className={`gap-1.5 whitespace-nowrap ${color}`}>
      {pago.estado === "APROBADO" ? (
        <CheckCircle2Icon className="size-3.5" />
      ) : esIzipayPendiente ? (
        <ShieldCheckIcon className="size-3.5" />
      ) : null}
      {texto}
    </Badge>
  );
}

function TarjetaResumen({
  titulo,
  valor,
  detalle,
  icono,
  tono,
}: {
  titulo: string;
  valor: string | number;
  detalle: string;
  icono: React.ReactNode;
  tono: string;
}) {
  return (
    <Card className="gap-3 py-4 shadow-sm">
      <CardContent className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-muted-foreground text-sm">{titulo}</p>
          <p className="mt-1 text-2xl font-semibold tracking-tight">{valor}</p>
          <p className="text-muted-foreground mt-1 text-xs">{detalle}</p>
        </div>
        <span
          className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${tono}`}
        >
          {icono}
        </span>
      </CardContent>
    </Card>
  );
}

function AccionConfirmar({
  pago,
  cargando,
  confirmar,
}: {
  pago: PagoAdminApi;
  cargando: boolean;
  confirmar: (id: string) => void;
}) {
  if (pago.metodo === "IZIPAY") {
    return (
      <span className="text-muted-foreground inline-flex items-center gap-1.5 text-xs">
        <ShieldCheckIcon className="size-3.5" /> Solo IPN
      </span>
    );
  }
  if (pago.estado !== "PENDIENTE")
    return <span className="text-muted-foreground">—</span>;

  return (
    <Button
      size="sm"
      variant="outline"
      className="w-full sm:w-auto"
      disabled={cargando}
      onClick={() => confirmar(pago.id)}
    >
      {cargando ? (
        <LoaderCircleIcon className="animate-spin" />
      ) : (
        <CheckCircle2Icon />
      )}
      Confirmar comprobante
    </Button>
  );
}

export default function PaginaPagos() {
  const [metodo, setMetodo] = useState<MetodoPago | "">("");
  const [estado, setEstado] = useState<EstadoPago | "">("");
  const [busqueda, setBusqueda] = useState("");
  const [codigoReserva, setCodigoReserva] = useState("");
  const [pagina, setPagina] = useState(1);
  const pagos = usePagosAdministracion({
    metodo: metodo || undefined,
    estado: estado || undefined,
    codigoReserva: codigoReserva || undefined,
    pagina,
    porPagina: POR_PAGINA,
  });
  const confirmar = useConfirmarPago();
  const lista = pagos.data?.datos ?? [];
  const pendientesManuales = lista.filter(
    (pago) => pago.metodo !== "IZIPAY" && pago.estado === "PENDIENTE",
  ).length;
  const izipayEnPagina = lista.filter(
    (pago) => pago.metodo === "IZIPAY",
  ).length;
  const totalPaginas = pagos.data?.totalPaginas ?? 0;

  const confirmarPago = (pagoId: string) => {
    if (
      window.confirm(
        "¿Confirmar este comprobante? La reserva quedará aprobada.",
      )
    ) {
      confirmar.mutate(pagoId);
    }
  };

  const buscarPagos = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setCodigoReserva(busqueda.trim());
    setPagina(1);
  };

  const cambiarMetodo = (valor: string) => {
    setMetodo(valor as MetodoPago | "");
    setPagina(1);
  };

  const cambiarEstado = (valor: string) => {
    setEstado(valor as EstadoPago | "");
    setPagina(1);
  };

  return (
    <div className="mx-auto flex w-full max-w-[1500px] flex-col gap-6 p-4 sm:p-6 xl:p-8">
      <header className="overflow-hidden rounded-2xl border border-black bg-black p-5 text-white sm:p-7">
        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-white">
              <CreditCardIcon className="size-4" /> Operación financiera
            </div>
            <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              Pagos y comprobantes
            </h1>
            <p className="mt-2 max-w-xl text-sm leading-6 text-white sm:text-base">
              Revisa los pagos de las reservas y valida los comprobantes
              manuales desde un solo lugar.
            </p>
          </div>
          <Button
            variant="outline"
            className="w-full shrink-0 border-white bg-black text-white hover:bg-white hover:text-black sm:w-auto"
            onClick={() => void pagos.refetch()}
            disabled={pagos.isFetching}
          >
            <RefreshCwIcon className={pagos.isFetching ? "animate-spin" : ""} />
            Actualizar
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
        <TarjetaResumen
          titulo="Pagos encontrados"
          valor={pagos.data?.total ?? (pagos.isLoading ? "—" : 0)}
          detalle="Según los filtros aplicados"
          icono={<WalletCardsIcon className="size-5" />}
          tono="bg-primary/10 text-primary"
        />
        <TarjetaResumen
          titulo="Comprobantes pendientes"
          valor={pagos.isLoading ? "—" : pendientesManuales}
          detalle="En esta página, requieren revisión manual"
          icono={<ArrowDownLeftIcon className="size-5" />}
          tono="bg-amber-500/10 text-amber-700 dark:text-amber-300"
        />
        <TarjetaResumen
          titulo="Pagos Izipay"
          valor={pagos.isLoading ? "—" : izipayEnPagina}
          detalle="En esta página, se validan por IPN firmado"
          icono={<ShieldCheckIcon className="size-5" />}
          tono="bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
        />
      </div>

      <Card className="gap-0 overflow-hidden py-0 shadow-sm">
        <CardHeader className="border-b px-4 py-5 sm:px-6">
          <div className="flex flex-col gap-1">
            <CardTitle className="text-lg">Registro de pagos</CardTitle>
            <CardDescription>
              Izipay se confirma exclusivamente mediante IPN firmado. Solo los
              pagos manuales admiten confirmación desde este panel.
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-5 p-4 sm:p-6">
          <form
            onSubmit={buscarPagos}
            className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-[minmax(220px,1fr)_220px_220px_auto]"
          >
            <label className="relative block">
              <span className="text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2">
                <SearchIcon className="size-4" />
              </span>
              <input
                value={busqueda}
                onChange={(event) => setBusqueda(event.target.value)}
                placeholder="Buscar por código de reserva"
                aria-label="Buscar por código de reserva"
                className="border-input bg-background placeholder:text-muted-foreground focus-visible:ring-ring h-10 w-full rounded-md border px-9 text-sm outline-none focus-visible:ring-2"
              />
            </label>
            <select
              aria-label="Filtrar por método de pago"
              className="border-input bg-background h-10 w-full rounded-md border px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
              value={metodo}
              onChange={(event) => cambiarMetodo(event.target.value)}
            >
              <option value="">Todos los métodos</option>
              <option value="IZIPAY">Izipay</option>
              <option value="TRANSFERENCIA">Transferencia</option>
              <option value="EFECTIVO_OFICINA">Efectivo en oficina</option>
            </select>
            <select
              aria-label="Filtrar por estado"
              className="border-input bg-background h-10 w-full rounded-md border px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
              value={estado}
              onChange={(event) => cambiarEstado(event.target.value)}
            >
              <option value="">Todos los estados</option>
              <option value="PENDIENTE">Pendiente</option>
              <option value="APROBADO">Aprobado</option>
              <option value="RECHAZADO">Rechazado</option>
              <option value="REEMBOLSADO">Reembolsado</option>
            </select>
            <Button type="submit" className="h-10 w-full xl:w-auto">
              <SearchIcon /> Buscar
            </Button>
          </form>

          {confirmar.isError && (
            <div
              role="alert"
              className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive"
            >
              No se pudo confirmar el comprobante. Actualiza la lista y vuelve a
              intentarlo.
            </div>
          )}

          {pagos.isError && (
            <div
              role="alert"
              className="flex flex-col gap-3 rounded-xl border border-destructive/30 bg-destructive/5 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5"
            >
              <div>
                <p className="font-medium text-destructive">
                  No se pudieron cargar los pagos
                </p>
                <p className="text-muted-foreground mt-1 text-sm">
                  Revisa tu conexión o vuelve a intentarlo.
                </p>
              </div>
              <Button
                variant="outline"
                className="w-full sm:w-auto"
                onClick={() => void pagos.refetch()}
              >
                <RefreshCwIcon /> Reintentar
              </Button>
            </div>
          )}

          {pagos.isLoading && (
            <div className="flex min-h-44 flex-col items-center justify-center gap-3 rounded-xl border border-dashed">
              <LoaderCircleIcon className="text-muted-foreground size-6 animate-spin" />
              <p className="text-muted-foreground text-sm">Cargando pagos…</p>
            </div>
          )}

          {!pagos.isLoading && !pagos.isError && lista.length === 0 && (
            <div className="flex min-h-52 flex-col items-center justify-center rounded-xl border border-dashed px-5 text-center">
              <span className="bg-muted mb-3 flex size-12 items-center justify-center rounded-full">
                <FileSearchIcon className="text-muted-foreground size-5" />
              </span>
              <p className="font-medium">No hay pagos para estos filtros</p>
              <p className="text-muted-foreground mt-1 text-sm">
                Prueba con otro método, estado o código de reserva.
              </p>
            </div>
          )}

          {lista.length > 0 && (
            <>
              <div className="hidden overflow-hidden rounded-xl border md:block">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[940px] text-sm">
                    <thead className="bg-muted/50 text-muted-foreground">
                      <tr className="border-b text-left">
                        <th className="px-4 py-3 font-medium">
                          Reserva / fecha
                        </th>
                        <th className="px-4 py-3 font-medium">Cliente</th>
                        <th className="px-4 py-3 font-medium">Método</th>
                        <th className="px-4 py-3 font-medium">Importe</th>
                        <th className="px-4 py-3 font-medium">Estado</th>
                        <th className="px-4 py-3 font-medium">Referencia</th>
                        <th className="px-4 py-3 text-right font-medium">
                          Acción
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {lista.map((pago) => (
                        <tr
                          key={pago.id}
                          className="transition-colors hover:bg-muted/30"
                        >
                          <td className="px-4 py-4">
                            <p className="font-semibold">
                              {pago.reserva.codigo}
                            </p>
                            <p className="text-muted-foreground mt-1 inline-flex items-center gap-1.5 text-xs">
                              <CalendarClockIcon className="size-3.5" />{" "}
                              {formatearFecha(pago.creadoEn)}
                            </p>
                          </td>
                          <td className="max-w-56 truncate px-4 py-4">
                            {pago.reserva.correoContacto}
                          </td>
                          <td className="px-4 py-4">
                            <Badge variant="secondary">
                              {nombresMetodo[pago.metodo]}
                            </Badge>
                          </td>
                          <td className="px-4 py-4 font-semibold tabular-nums">
                            {formatearMonto(pago)}
                          </td>
                          <td className="px-4 py-4">
                            <EstadoPagoBadge pago={pago} />
                          </td>
                          <td className="max-w-48 break-all px-4 py-4 text-xs text-muted-foreground">
                            {pago.referenciaProveedor ??
                              pago.codigoOperacion ??
                              "Sin referencia"}
                          </td>
                          <td className="px-4 py-4 text-right">
                            <AccionConfirmar
                              pago={pago}
                              cargando={confirmar.isPending}
                              confirmar={confirmarPago}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="grid gap-3 md:hidden">
                {lista.map((pago) => (
                  <article
                    key={pago.id}
                    className="rounded-xl border bg-card p-4 shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate font-semibold">
                          Reserva {pago.reserva.codigo}
                        </p>
                        <p className="text-muted-foreground mt-1 inline-flex items-center gap-1.5 text-xs">
                          <CalendarClockIcon className="size-3.5 shrink-0" />{" "}
                          {formatearFecha(pago.creadoEn)}
                        </p>
                      </div>
                      <EstadoPagoBadge pago={pago} />
                    </div>
                    <div className="my-4 grid grid-cols-2 gap-x-3 gap-y-4 border-y py-4 text-sm">
                      <div className="min-w-0">
                        <p className="text-muted-foreground text-xs">Cliente</p>
                        <p className="mt-1 truncate font-medium">
                          {pago.reserva.correoContacto}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-xs">Importe</p>
                        <p className="mt-1 font-semibold tabular-nums">
                          {formatearMonto(pago)}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-xs">Método</p>
                        <p className="mt-1">
                          <Badge variant="secondary">
                            {nombresMetodo[pago.metodo]}
                          </Badge>
                        </p>
                      </div>
                      <div className="min-w-0">
                        <p className="text-muted-foreground text-xs">
                          Referencia
                        </p>
                        <p className="mt-1 break-all text-xs">
                          {pago.referenciaProveedor ??
                            pago.codigoOperacion ??
                            "Sin referencia"}
                        </p>
                      </div>
                    </div>
                    <AccionConfirmar
                      pago={pago}
                      cargando={confirmar.isPending}
                      confirmar={confirmarPago}
                    />
                  </article>
                ))}
              </div>
            </>
          )}

          {pagos.data && pagos.data.total > 0 && (
            <div className="flex flex-col gap-3 border-t pt-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-muted-foreground text-center text-sm sm:text-left">
                Página{" "}
                <span className="text-foreground font-medium">
                  {pagos.data.pagina}
                </span>{" "}
                de {pagos.data.totalPaginas} · {pagos.data.total} pagos
              </p>
              <div className="flex items-center justify-center gap-2 sm:justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  className="min-w-28"
                  disabled={pagina <= 1 || pagos.isFetching}
                  onClick={() => setPagina((actual) => Math.max(1, actual - 1))}
                >
                  <ArrowLeftIcon /> Anterior
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="min-w-28"
                  disabled={pagina >= totalPaginas || pagos.isFetching}
                  onClick={() =>
                    setPagina((actual) => Math.min(totalPaginas, actual + 1))
                  }
                >
                  Siguiente <ArrowRightIcon />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex items-start gap-3 rounded-xl border border-primary/15 bg-primary/[0.035] p-4 text-sm">
        <CircleDollarSignIcon className="text-primary mt-0.5 size-5 shrink-0" />
        <p className="text-muted-foreground leading-6">
          <span className="text-foreground font-medium">
            Protección de pagos:
          </span>{" "}
          los pagos con tarjeta se aprueban únicamente al recibir y verificar la
          notificación firmada de Izipay. Confirma manualmente solo después de
          revisar el comprobante bancario o de oficina.
        </p>
      </div>
    </div>
  );
}
