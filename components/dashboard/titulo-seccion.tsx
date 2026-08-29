import { CardDescription, CardTitle } from "@/components/ui/card";

/** Encabezado de sección de formulario: número en círculo + icono + título. */
export function TituloSeccion({
  paso,
  titulo,
  descripcion,
  icono,
}: {
  paso: string;
  titulo: string;
  descripcion?: string;
  icono?: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="bg-primary text-primary-foreground mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold">
        {paso}
      </span>
      <div className="grid gap-1">
        <CardTitle className="flex items-center gap-2 [&_svg]:size-4">
          {icono}
          {titulo}
        </CardTitle>
        {descripcion && <CardDescription>{descripcion}</CardDescription>}
      </div>
    </div>
  );
}
