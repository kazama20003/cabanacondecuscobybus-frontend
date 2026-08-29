"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeftIcon,
  BusIcon,
  CalendarClockIcon,
  CoinsIcon,
  MapIcon,
  RepeatIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  useCrearPlantilla,
  useCrearSalida,
  useTours,
  useTransportes,
} from "@/hooks/use-catalogo";

const DIAS = [
  { valor: 1, nombre: "Lun" },
  { valor: 2, nombre: "Mar" },
  { valor: 3, nombre: "Mié" },
  { valor: 4, nombre: "Jue" },
  { valor: 5, nombre: "Vie" },
  { valor: 6, nombre: "Sáb" },
  { valor: 7, nombre: "Dom" },
];

const inicial = {
  tipo: "TRANSPORTE" as "TRANSPORTE" | "TOUR",
  servicioId: "",
  fechaHoraSalida: "",
  horaSalida: "",
  diasSemana: [] as number[],
  fechaDesde: "",
  fechaHasta: "",
  capacidad: "",
  minimoPasajeros: "",
  precioPen: "",
  precioUsd: "",
};

/** Encabezado de sección del formulario: número + título + descripción. */
function SeccionForm({
  paso,
  titulo,
  descripcion,
  icono,
}: {
  paso: string;
  titulo: string;
  descripcion: string;
  icono: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="bg-primary text-primary-foreground mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold">
        {paso}
      </span>
      <div>
        <p className="flex items-center gap-2 font-medium [&_svg]:size-4">
          {icono}
          {titulo}
        </p>
        <p className="text-muted-foreground text-sm">{descripcion}</p>
      </div>
    </div>
  );
}

export default function PaginaNuevaSalida() {
  const router = useRouter();
  const [modo, setModo] = useState<"UNICA" | "RECURRENTE">("UNICA");
  const [campos, setCampos] = useState(inicial);
  const crear = useCrearSalida();
  const crearPlantilla = useCrearPlantilla();
  const { data: transportes } = useTransportes({ porPagina: 100 });
  const { data: tours } = useTours({ porPagina: 100 });

  const opciones =
    campos.tipo === "TRANSPORTE"
      ? (transportes?.datos ?? []).map((t) => ({
          id: t.id,
          nombre: `${t.origenNombre} → ${t.destinoNombre}`,
        }))
      : (tours?.datos ?? []).map((t) => ({
          id: t.id,
          nombre: String(t.nombre ?? t.destinoNombre ?? t.slug),
        }));

  const alternarDia = (dia: number) =>
    setCampos((c) => ({
      ...c,
      diasSemana: c.diasSemana.includes(dia)
        ? c.diasSemana.filter((d) => d !== dia)
        : [...c.diasSemana, dia],
    }));

  const mutacion = modo === "UNICA" ? crear : crearPlantilla;

  const enviar = (e: React.FormEvent) => {
    e.preventDefault();
    const base = {
      capacidad: Number(campos.capacidad),
      minimoPasajeros: campos.minimoPasajeros
        ? Number(campos.minimoPasajeros)
        : undefined,
      precioPen: Number(campos.precioPen),
      precioUsd: Number(campos.precioUsd),
    };
    const alTerminar = { onSuccess: () => router.push("/dashboard/salidas") };
    if (modo === "UNICA") {
      crear.mutate(
        {
          tipo: campos.tipo,
          servicioId: campos.servicioId,
          datos: {
            ...base,
            fechaHoraSalida: new Date(campos.fechaHoraSalida).toISOString(),
          },
        },
        alTerminar,
      );
    } else {
      crearPlantilla.mutate(
        {
          tipo: campos.tipo,
          servicioId: campos.servicioId,
          datos: {
            ...base,
            horaSalida: campos.horaSalida,
            diasSemana: campos.diasSemana,
            fechaDesde: campos.fechaDesde,
            fechaHasta: campos.fechaHasta || undefined,
          },
        },
        alTerminar,
      );
    }
  };

  const listoParaEnviar =
    campos.servicioId &&
    campos.capacidad &&
    campos.precioPen &&
    campos.precioUsd &&
    (modo === "UNICA"
      ? campos.fechaHoraSalida
      : campos.horaSalida && campos.fechaDesde && campos.diasSemana.length > 0);

  const servicioElegido = opciones.find((o) => o.id === campos.servicioId);

  return (
    <div className="flex w-full flex-col gap-4 p-4 lg:p-6">
      <div>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard/salidas">
            <ArrowLeftIcon />
            Volver a salidas
          </Link>
        </Button>
      </div>

      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Programar salida
        </h1>
        <p className="text-muted-foreground text-sm">
          Publica una fecha puntual, o define un horario recurrente y las
          salidas se generan solas.
        </p>
      </div>

      <div className="grid items-start gap-4 lg:grid-cols-[1fr_360px]">
      <div className="flex flex-col gap-4">
      {/* Selector de modo: dos tarjetas grandes */}
      <div className="grid gap-3 sm:grid-cols-2">
        {(
          [
            {
              valor: "UNICA",
              titulo: "Salida única",
              descripcion: "Una fecha y hora concreta.",
              icono: <CalendarClockIcon />,
            },
            {
              valor: "RECURRENTE",
              titulo: "Horario recurrente",
              descripcion: "Se repite ciertos días de la semana.",
              icono: <RepeatIcon />,
            },
          ] as const
        ).map((op) => (
          <button
            key={op.valor}
            type="button"
            onClick={() => setModo(op.valor)}
            className={`rounded-2xl border p-4 text-left transition-colors ${
              modo === op.valor
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card hover:bg-accent"
            }`}
          >
            <span className="flex items-center gap-2 font-medium [&_svg]:size-4">
              {op.icono}
              {op.titulo}
            </span>
            <span
              className={`mt-1 block text-sm ${
                modo === op.valor
                  ? "text-primary-foreground/70"
                  : "text-muted-foreground"
              }`}
            >
              {op.descripcion}
            </span>
          </button>
        ))}
      </div>

      <Card>
        <CardContent className="pt-6">
          <form onSubmit={enviar} className="flex flex-col gap-6">
            {/* 1. Servicio */}
            <SeccionForm
              paso="1"
              titulo="Servicio"
              descripcion="Qué ruta o tour vas a programar."
              icono={campos.tipo === "TRANSPORTE" ? <BusIcon /> : <MapIcon />}
            />
            <div className="grid gap-4 pl-11 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label>Tipo de servicio</Label>
                <Select
                  value={campos.tipo}
                  onValueChange={(tipo) =>
                    setCampos((c) => ({
                      ...c,
                      tipo: tipo as "TRANSPORTE" | "TOUR",
                      servicioId: "",
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="TRANSPORTE">Transporte</SelectItem>
                    <SelectItem value="TOUR">Tour</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>{campos.tipo === "TRANSPORTE" ? "Ruta" : "Tour"}</Label>
                <Select
                  value={campos.servicioId}
                  onValueChange={(servicioId) =>
                    setCampos((c) => ({ ...c, servicioId }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona…" />
                  </SelectTrigger>
                  <SelectContent>
                    {opciones.map((o) => (
                      <SelectItem key={o.id} value={o.id}>
                        {o.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Separator />

            {/* 2. Programación */}
            <SeccionForm
              paso="2"
              titulo="Programación"
              descripcion={
                modo === "UNICA"
                  ? "Fecha y hora exacta de esta salida."
                  : "Días, hora y vigencia del horario."
              }
              icono={<CalendarClockIcon />}
            />
            {modo === "UNICA" ? (
              <div className="grid gap-2 pl-11 sm:max-w-xs">
                <Label htmlFor="fechaSalida">Fecha y hora de salida</Label>
                <Input
                  id="fechaSalida"
                  required
                  type="datetime-local"
                  value={campos.fechaHoraSalida}
                  onChange={(e) =>
                    setCampos((c) => ({
                      ...c,
                      fechaHoraSalida: e.target.value,
                    }))
                  }
                />
              </div>
            ) : (
              <div className="flex flex-col gap-4 pl-11">
                <div className="grid gap-2">
                  <Label>Días de salida</Label>
                  <div className="flex flex-wrap gap-1.5">
                    {DIAS.map((d) => {
                      const activo = campos.diasSemana.includes(d.valor);
                      return (
                        <button
                          key={d.valor}
                          type="button"
                          onClick={() => alternarDia(d.valor)}
                          className={`size-11 rounded-full border text-sm font-medium transition-colors ${
                            activo
                              ? "border-primary bg-primary text-primary-foreground"
                              : "border-border bg-card text-muted-foreground hover:bg-accent hover:text-foreground"
                          }`}
                        >
                          {d.nombre}
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="grid gap-2">
                    <Label htmlFor="horaSalida">Hora de salida</Label>
                    <Input
                      id="horaSalida"
                      required
                      type="time"
                      value={campos.horaSalida}
                      onChange={(e) =>
                        setCampos((c) => ({
                          ...c,
                          horaSalida: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="fechaDesde">Disponible desde</Label>
                    <Input
                      id="fechaDesde"
                      required
                      type="date"
                      value={campos.fechaDesde}
                      onChange={(e) =>
                        setCampos((c) => ({
                          ...c,
                          fechaDesde: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="fechaHasta">Hasta (opcional)</Label>
                    <Input
                      id="fechaHasta"
                      type="date"
                      value={campos.fechaHasta}
                      onChange={(e) =>
                        setCampos((c) => ({
                          ...c,
                          fechaHasta: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>
                <p className="text-muted-foreground text-xs">
                  Sin fecha final, las salidas se generan de forma continua (60
                  días hacia adelante, extendidas automáticamente cada día).
                </p>
              </div>
            )}

            <Separator />

            {/* 3. Cupos y precios */}
            <SeccionForm
              paso="3"
              titulo="Cupos y precios"
              descripcion="Capacidad del vehículo y tarifas por pasajero."
              icono={<CoinsIcon />}
            />
            <div className="grid gap-4 pl-11 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="capacidad">Capacidad</Label>
                <Input id="capacidad" required type="number" min={1} placeholder="20" value={campos.capacidad} onChange={(e) => setCampos((c) => ({ ...c, capacidad: e.target.value }))} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="minimo">Mínimo pasajeros</Label>
                <Input id="minimo" type="number" min={1} placeholder="2" value={campos.minimoPasajeros} onChange={(e) => setCampos((c) => ({ ...c, minimoPasajeros: e.target.value }))} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="precioPen">Precio S/</Label>
                <Input id="precioPen" required type="number" min={0} step="0.01" placeholder="150" value={campos.precioPen} onChange={(e) => setCampos((c) => ({ ...c, precioPen: e.target.value }))} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="precioUsd">Precio US$</Label>
                <Input id="precioUsd" required type="number" min={0} step="0.01" placeholder="45" value={campos.precioUsd} onChange={(e) => setCampos((c) => ({ ...c, precioUsd: e.target.value }))} />
              </div>
            </div>

            {mutacion.isError && (
              <p className="text-destructive pl-11 text-sm">
                {mutacion.error.message}
              </p>
            )}
          </form>
        </CardContent>
      </Card>
      </div>

      {/* Resumen lateral sticky */}
      <Card className="lg:sticky lg:top-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base [&_svg]:size-4">
            {modo === "UNICA" ? <CalendarClockIcon /> : <RepeatIcon />}
            Resumen
          </CardTitle>
          <CardDescription>
            {modo === "UNICA" ? "Salida única" : "Horario recurrente"}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 text-sm">
          <div className="flex justify-between gap-2">
            <span className="text-muted-foreground">Servicio</span>
            <span className="text-right font-medium">
              {servicioElegido?.nombre ?? "—"}
            </span>
          </div>
          <Separator />
          {modo === "UNICA" ? (
            <div className="flex justify-between gap-2">
              <span className="text-muted-foreground">Fecha</span>
              <span className="text-right font-medium">
                {campos.fechaHoraSalida
                  ? new Date(campos.fechaHoraSalida).toLocaleString("es-PE", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })
                  : "—"}
              </span>
            </div>
          ) : (
            <>
              <div className="flex justify-between gap-2">
                <span className="text-muted-foreground">Días</span>
                <span className="text-right font-medium">
                  {campos.diasSemana.length > 0
                    ? [...campos.diasSemana]
                        .sort()
                        .map((d) => DIAS.find((x) => x.valor === d)?.nombre)
                        .join(" · ")
                    : "—"}
                </span>
              </div>
              <div className="flex justify-between gap-2">
                <span className="text-muted-foreground">Hora</span>
                <span className="font-medium">{campos.horaSalida || "—"}</span>
              </div>
              <div className="flex justify-between gap-2">
                <span className="text-muted-foreground">Vigencia</span>
                <span className="text-right font-medium">
                  {campos.fechaDesde
                    ? `${campos.fechaDesde} → ${campos.fechaHasta || "indefinida"}`
                    : "—"}
                </span>
              </div>
            </>
          )}
          <Separator />
          <div className="flex justify-between gap-2">
            <span className="text-muted-foreground">Capacidad</span>
            <span className="font-medium">
              {campos.capacidad || "—"}
              {campos.minimoPasajeros ? ` (mín. ${campos.minimoPasajeros})` : ""}
            </span>
          </div>
          <div className="flex justify-between gap-2">
            <span className="text-muted-foreground">Precio</span>
            <span className="font-medium">
              {campos.precioPen ? `S/ ${campos.precioPen}` : "—"}
              {campos.precioUsd ? ` · US$ ${campos.precioUsd}` : ""}
            </span>
          </div>
          <div className="mt-2 flex flex-col gap-2">
            <Button
              onClick={enviar}
              disabled={mutacion.isPending || !listoParaEnviar}
            >
              {mutacion.isPending
                ? "Guardando…"
                : modo === "UNICA"
                  ? "Programar salida"
                  : "Crear horario recurrente"}
            </Button>
            <Button type="button" variant="outline" asChild>
              <Link href="/dashboard/salidas">Cancelar</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
      </div>
    </div>
  );
}
