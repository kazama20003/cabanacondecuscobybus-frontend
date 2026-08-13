"use client";

import { useState } from "react";
import Link from "next/link";

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
      <path
        fill="#4285F4"
        d="M23.49 12.27c0-.85-.08-1.66-.22-2.45H12v4.63h6.45a5.52 5.52 0 0 1-2.39 3.62v3h3.86c2.26-2.09 3.57-5.17 3.57-8.8z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.96-1.07 7.94-2.92l-3.86-3c-1.07.72-2.44 1.15-4.08 1.15-3.13 0-5.79-2.11-6.74-4.96H1.28v3.09A12 12 0 0 0 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.26 14.27A7.19 7.19 0 0 1 4.88 12c0-.79.14-1.55.38-2.27V6.64H1.28a12 12 0 0 0 0 10.72l3.98-3.09z"
      />
      <path
        fill="#EA4335"
        d="M12 4.77c1.77 0 3.35.61 4.6 1.8l3.42-3.42A11.97 11.97 0 0 0 12 0 12 12 0 0 0 1.28 6.64l3.98 3.09C6.21 6.88 8.87 4.77 12 4.77z"
      />
    </svg>
  );
}

/* Acceso únicamente con Google, sobre la card de vidrio del layout (auth).
   El mismo botón crea la cuenta la primera vez e inicia sesión después. */
export default function AuthForm({ mode }: { mode: "login" | "register" }) {
  const isLogin = mode === "login";
  const [clicked, setClicked] = useState(false);
  const [hover, setHover] = useState(false);

  return (
    <div style={{ color: "#fff", textAlign: "center" }}>
      <h1 style={{ margin: "0 0 10px", fontSize: "clamp(28px, 3vw, 36px)", lineHeight: 1.12, letterSpacing: "-0.02em", fontWeight: 400 }}>
        {isLogin ? (
          <>
            Bienvenido de <em className="serif">vuelta</em>.
          </>
        ) : (
          <>
            Crea tu <em className="serif">cuenta</em>.
          </>
        )}
      </h1>
      <p style={{ margin: "0 0 30px", fontSize: 14, lineHeight: 1.55, color: "rgba(255,255,255,.72)", textWrap: "pretty" }}>
        {isLogin
          ? "Ingresa con tu cuenta de Google para ver y gestionar tus reservas."
          : "Usa tu cuenta de Google y listo: sin contraseñas ni formularios."}
      </p>

      <button
        type="button"
        onClick={() => {
          setClicked(true);
          /* TODO: iniciar flujo OAuth de Google cuando el backend esté listo */
        }}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
          padding: "13px 16px",
          fontSize: 15,
          fontWeight: 600,
          borderRadius: 12,
          border: "none",
          background: "#fff",
          color: "#111110",
          cursor: "pointer",
          transform: hover ? "translateY(-1px)" : "none",
          boxShadow: hover ? "0 12px 30px rgba(0,0,0,.35)" : "0 6px 18px rgba(0,0,0,.25)",
          transition: "transform .2s ease, box-shadow .2s ease",
        }}
      >
        <GoogleIcon />
        Continuar con Google
      </button>

      {clicked && (
        <p role="status" style={{ margin: "16px 0 0", fontSize: 13, color: "rgba(255,255,255,.72)", textWrap: "pretty" }}>
          El acceso con Google estará disponible muy pronto. Mientras tanto, reserva por WhatsApp o desde la página de contacto.
        </p>
      )}

      <div
        style={{
          margin: "28px 0 0",
          padding: "18px 0 0",
          borderTop: "1px solid rgba(255,255,255,.14)",
          display: "flex",
          flexDirection: "column",
          gap: 8,
          fontSize: 13,
          color: "rgba(255,255,255,.72)",
          textAlign: "left",
        }}
      >
        <span>✓ Sin contraseñas que recordar</span>
        <span>✓ Tus reservas de transporte, tours y traslados en un solo lugar</span>
        <span>✓ Solo usamos tu nombre y correo, nada más</span>
      </div>

      <p style={{ margin: "28px 0 0", fontSize: 13.5, color: "rgba(255,255,255,.72)" }}>
        {isLogin ? (
          <>
            ¿Primera vez aquí?{" "}
            <Link href="/registro" style={{ fontWeight: 600, color: "#fff" }}>
              Crea tu cuenta
            </Link>
          </>
        ) : (
          <>
            ¿Ya tienes cuenta?{" "}
            <Link href="/login" style={{ fontWeight: 600, color: "#fff" }}>
              Inicia sesión
            </Link>
          </>
        )}
      </p>
      <p style={{ margin: "16px 0 0", fontSize: 12 }}>
        <Link href="/" style={{ color: "rgba(255,255,255,.6)" }}>
          ← Volver al inicio
        </Link>
      </p>
    </div>
  );
}
