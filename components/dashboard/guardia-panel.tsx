"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { useMiPerfil } from "@/hooks/use-auth";
import { tokenStorage } from "@/lib/api";

const ROLES_PANEL = ["ADMINISTRADOR", "OPERADOR"];

/* Bloqueo de acceso al panel: sin sesión → /login; sin rol de personal → inicio. */
export function GuardiaPanel({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { data: perfil, isLoading, isError } = useMiPerfil();
  const hayToken = typeof window !== "undefined" && !!tokenStorage.obtener();

  useEffect(() => {
    if (!hayToken || isError) {
      router.replace("/login");
      return;
    }
    if (perfil && !ROLES_PANEL.includes(perfil.rol)) {
      router.replace("/");
    }
  }, [hayToken, isError, perfil, router]);

  if (!hayToken || isLoading || !perfil || !ROLES_PANEL.includes(perfil.rol)) {
    return (
      <div className="flex flex-col gap-4 p-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }
  return <>{children}</>;
}
