"use client";

import { CSSProperties, useState } from "react";
import Link from "next/link";

const inputStyle: CSSProperties = {
  width: "100%",
  padding: "11px 14px",
  fontSize: 14,
  borderRadius: 8,
  border: "1px solid var(--line)",
  background: "var(--card)",
  color: "var(--fg)",
  outline: "none",
};

const labelStyle: CSSProperties = {
  display: "block",
  fontSize: 13,
  fontWeight: 600,
  marginBottom: 6,
};

function GoogleIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" aria-hidden>
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

/* Formulario compartido de login / registro. Solo UI por ahora: la
   autenticación real (Google OAuth + backend) se conecta después. */
export default function AuthForm({ mode }: { mode: "login" | "register" }) {
  const isLogin = mode === "login";
  const [sent, setSent] = useState(false);

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
      <p style={{ margin: "0 0 28px", fontSize: 14, lineHeight: 1.5, color: "var(--muted)", textWrap: "pretty" }}>
        {isLogin
          ? "Ingresa para ver y gestionar tus reservas."
          : "Regístrate para reservar más rápido y guardar tus viajes."}
      </p>

      <button
        type="button"
        onClick={() => {
          /* TODO: iniciar flujo OAuth de Google cuando el backend esté listo */
        }}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
          padding: "11px 16px",
          fontSize: 14,
          fontWeight: 600,
          borderRadius: 8,
          border: "1px solid var(--line)",
          background: "var(--card)",
          color: "var(--fg)",
          cursor: "pointer",
        }}
      >
        <GoogleIcon />
        Continuar con Google
      </button>

      <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "22px 0", color: "var(--muted)", fontSize: 12.5 }}>
        <span style={{ flex: 1, height: 1, background: "var(--line)" }} />
        o con tu correo
        <span style={{ flex: 1, height: 1, background: "var(--line)" }} />
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          setSent(true);
        }}
        style={{ display: "flex", flexDirection: "column", gap: 16 }}
      >
        {!isLogin && (
          <div>
            <label htmlFor="name" style={labelStyle}>
              Nombre completo
            </label>
            <input id="name" name="name" type="text" required placeholder="María Fernández" autoComplete="name" style={inputStyle} />
          </div>
        )}
        <div>
          <label htmlFor="email" style={labelStyle}>
            Correo electrónico
          </label>
          <input id="email" name="email" type="email" required placeholder="tu@correo.com" autoComplete="email" style={inputStyle} />
        </div>
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <label htmlFor="password" style={labelStyle}>
              Contraseña
            </label>
            {isLogin && (
              <Link href="/contacto" style={{ fontSize: 12.5, color: "var(--muted)" }}>
                ¿La olvidaste?
              </Link>
            )}
          </div>
          <input
            id="password"
            name="password"
            type="password"
            required
            minLength={8}
            placeholder="Mínimo 8 caracteres"
            autoComplete={isLogin ? "current-password" : "new-password"}
            style={inputStyle}
          />
        </div>

        <button
          type="submit"
          style={{
            width: "100%",
            padding: "11px 16px",
            fontSize: 14,
            fontWeight: 600,
            borderRadius: 8,
            border: "none",
            background: "var(--btn-bg)",
            color: "var(--btn-fg)",
            cursor: "pointer",
          }}
        >
          {isLogin ? "Iniciar sesión" : "Crear cuenta"}
        </button>

        {sent && (
          <p role="status" style={{ margin: 0, fontSize: 13, color: "var(--muted)", textAlign: "center" }}>
            El acceso con cuenta estará disponible muy pronto. Mientras tanto, reserva por WhatsApp o contacto.
          </p>
        )}
      </form>

      <p style={{ margin: "26px 0 0", fontSize: 13.5, color: "var(--muted)", textAlign: "center" }}>
        {isLogin ? (
          <>
            ¿Aún no tienes cuenta?{" "}
            <Link href="/registro" style={{ fontWeight: 600 }}>
              Regístrate
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
