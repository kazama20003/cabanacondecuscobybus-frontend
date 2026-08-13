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

/* Acceso únicamente con Google: sin contraseñas ni formularios.
   El mismo botón crea la cuenta la primera vez e inicia sesión después. */
export default function AuthForm({ mode }: { mode: "login" | "register" }) {
  const isLogin = mode === "login";
  const [clicked, setClicked] = useState(false);

  return (
    <div>
      <h1 style={{ margin: "0 0 8px", fontSize: "clamp(28px, 3vw, 38px)", lineHeight: 1.1, letterSpacing: "-0.02em", fontWeight: 400 }}>
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
      <p style={{ margin: "0 0 32px", fontSize: 14, lineHeight: 1.5, color: "var(--muted)", textWrap: "pretty" }}>
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
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
          padding: "13px 16px",
          fontSize: 15,
          fontWeight: 600,
          borderRadius: 8,
          border: "none",
          background: "var(--btn-bg)",
          color: "var(--btn-fg)",
          cursor: "pointer",
        }}
      >
        <span
          style={{
            width: 26,
            height: 26,
            borderRadius: "50%",
            background: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <GoogleIcon />
        </span>
        Continuar con Google
      </button>

      {clicked && (
        <p role="status" style={{ margin: "16px 0 0", fontSize: 13, color: "var(--muted)", textAlign: "center", textWrap: "pretty" }}>
          El acceso con Google estará disponible muy pronto. Mientras tanto, reserva por WhatsApp o desde la página de contacto.
        </p>
      )}

      <ul style={{ margin: "28px 0 0", padding: 0, listStyle: "none", fontSize: 13, color: "var(--muted)", lineHeight: 2 }}>
        <li>✓ Sin contraseñas que recordar</li>
        <li>✓ Tus reservas de transporte, tours y traslados en un solo lugar</li>
        <li>✓ Solo usamos tu nombre y correo, nada más</li>
      </ul>

      <p style={{ margin: "28px 0 0", fontSize: 13.5, color: "var(--muted)", textAlign: "center" }}>
        {isLogin ? (
          <>
            ¿Primera vez aquí?{" "}
            <Link href="/registro" style={{ fontWeight: 600 }}>
              Crea tu cuenta
            </Link>
          </>
        ) : (
          <>
            ¿Ya tienes cuenta?{" "}
            <Link href="/login" style={{ fontWeight: 600 }}>
              Inicia sesión
            </Link>
          </>
        )}
      </p>
      <p style={{ margin: "18px 0 0", fontSize: 12, color: "var(--muted)", textAlign: "center" }}>
        <Link href="/" style={{ color: "var(--muted)" }}>
          ← Volver al inicio
        </Link>
      </p>
    </div>
  );
}
