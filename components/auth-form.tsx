"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSesionGoogle } from "@/hooks/use-auth";
import { avatarStorage } from "@/lib/api";
import { useT } from "@/lib/i18n";

/* El ID token de Google es un JWT: el payload trae picture/name. */
function extraerFotoGoogle(credential: string): string {
  try {
    const payload = JSON.parse(
      atob(credential.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")),
    ) as { picture?: string };
    return payload.picture ?? "";
  } catch {
    return "";
  }
}

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? "";

type CredencialGoogle = { credential?: string };

let googleInicializado = false;
let manejarCredencialActiva: ((respuesta: CredencialGoogle) => void) | null =
  null;

function reenviarCredencialGoogle(respuesta: CredencialGoogle) {
  manejarCredencialActiva?.(respuesta);
}

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (respuesta: CredencialGoogle) => void;
          }) => void;
          renderButton: (
            elemento: HTMLElement,
            opciones: {
              theme: "filled_black";
              size: "large";
              text: "continue_with";
              shape: "rectangular";
              width: number;
            },
          ) => void;
        };
      };
    };
  }
}

/* Acceso únicamente con Google, con el lenguaje visual del sitio:
   título grande con serif itálica, card blanca redondeada y botón sólido. */
export default function AuthForm({ mode }: { mode: "login" | "register" }) {
  const isLogin = mode === "login";
  const [hover, setHover] = useState(false);
  const [mensaje, setMensaje] = useState<string | null>(null);
  const router = useRouter();
  const sesionGoogle = useSesionGoogle();
  const t = useT();
  const botonGoogleRef = useRef<HTMLDivElement>(null);

  const manejarCredencialRef = useRef<(respuesta: CredencialGoogle) => void>(
    () => {},
  );
  manejarCredencialRef.current = (respuesta) => {
    if (!respuesta.credential) return;
    setMensaje(null);
    const foto = extraerFotoGoogle(respuesta.credential);
    if (foto) avatarStorage.guardar(foto);
    sesionGoogle.mutate(respuesta.credential, {
      onSuccess: (sesion) =>
        router.push(
          sesion.usuario.rol === "ADMINISTRADOR" ||
            sesion.usuario.rol === "OPERADOR"
            ? "/dashboard"
            : "/cuenta",
        ),
      onError: (error) =>
        setMensaje(
          error instanceof Error ? error.message : t("auth.errGeneric"),
        ),
    });
  };

  useEffect(() => {
    const manejarCredencial = (respuesta: CredencialGoogle) =>
      manejarCredencialRef.current(respuesta);
    manejarCredencialActiva = manejarCredencial;
    let cancelado = false;
    let script = document.getElementById(
      "google-gsi",
    ) as HTMLScriptElement | null;
    let renderizarBoton: (() => void) | null = null;
    if (GOOGLE_CLIENT_ID && botonGoogleRef.current) {
      renderizarBoton = () => {
        const elemento = botonGoogleRef.current;
        if (cancelado || !elemento || !window.google) return;
        if (!googleInicializado) {
          window.google.accounts.id.initialize({
            client_id: GOOGLE_CLIENT_ID,
            callback: reenviarCredencialGoogle,
          });
          googleInicializado = true;
        }
        elemento.replaceChildren();
        window.google.accounts.id.renderButton(elemento, {
          theme: "filled_black",
          size: "large",
          text: "continue_with",
          shape: "rectangular",
          width: Math.min(
            400,
            Math.floor(elemento.getBoundingClientRect().width),
          ),
        });
      };

      if (window.google) renderizarBoton();
      else {
        let scriptCreado = false;
        if (!script) {
          script = document.createElement("script");
          script.id = "google-gsi";
          script.src = "https://accounts.google.com/gsi/client";
          script.async = true;
          script.defer = true;
          scriptCreado = true;
        }
        script.addEventListener("load", renderizarBoton);
        if (scriptCreado) document.head.appendChild(script);
      }
    }
    return () => {
      cancelado = true;
      if (renderizarBoton) script?.removeEventListener("load", renderizarBoton);
      if (manejarCredencialActiva === manejarCredencial)
        manejarCredencialActiva = null;
    };
  }, []);

  return (
    <div>
      {/* Título estilo hero de las vistas */}
      <h1
        style={{
          margin: "0 0 12px",
          fontSize: "clamp(36px, 4.4vw, 56px)",
          lineHeight: 1.08,
          letterSpacing: "-0.03em",
          fontWeight: 400,
          textWrap: "pretty",
        }}
      >
        {isLogin ? (
          <>
            {t("auth.loginTitlePre")}
            <em className="serif">{t("auth.loginTitleEm")}</em>.
          </>
        ) : (
          <>
            {t("auth.registerTitlePre")}
            <em className="serif">{t("auth.registerTitleEm")}</em>.
          </>
        )}
      </h1>
      <p
        style={{
          margin: "0 0 32px",
          fontSize: 15,
          lineHeight: 1.55,
          color: "var(--muted)",
          textWrap: "pretty",
        }}
      >
        {isLogin ? t("auth.loginSubtitle") : t("auth.registerSubtitle")}
      </p>

      {/* Card como las del resto del sitio */}
      <div
        style={{
          background: "var(--card)",
          borderRadius: 16,
          padding: "32px 28px",
        }}
      >
        <div
          ref={botonGoogleRef}
          aria-label={t("auth.continueGoogle")}
          aria-busy={sesionGoogle.isPending}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          style={{
            width: "100%",
            minHeight: 40,
            display: "flex",
            justifyContent: "center",
            opacity: sesionGoogle.isPending ? 0.7 : 1,
            pointerEvents: sesionGoogle.isPending ? "none" : "auto",
            transform: hover ? "translateY(-1px)" : "none",
            transition: "transform .2s ease, opacity .2s ease",
          }}
        />

        {(mensaje || (!GOOGLE_CLIENT_ID ? t("auth.errNoClientId") : null)) && (
          <p
            role="status"
            style={{
              margin: "14px 0 0",
              fontSize: 13,
              color: "var(--muted)",
              textAlign: "center",
              textWrap: "pretty",
            }}
          >
            {mensaje || t("auth.errNoClientId")}
          </p>
        )}
      </div>

      <p
        style={{
          margin: "24px 0 0",
          fontSize: 13.5,
          color: "var(--muted)",
          textAlign: "center",
        }}
      >
        {isLogin ? (
          <>
            {t("auth.firstTime")}{" "}
            <Link href="/registro" style={{ fontWeight: 600 }}>
              {t("auth.createAccount")}
            </Link>
          </>
        ) : (
          <>
            {t("auth.haveAccount")}{" "}
            <Link href="/login" style={{ fontWeight: 600 }}>
              {t("auth.signIn")}
            </Link>
          </>
        )}
      </p>
      <p style={{ margin: "14px 0 0", fontSize: 12.5, textAlign: "center" }}>
        <Link href="/" style={{ color: "var(--muted)" }}>
          {t("auth.backHome")}
        </Link>
      </p>
    </div>
  );
}
