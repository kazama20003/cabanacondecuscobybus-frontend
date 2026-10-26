"use client";

import Link from "next/link";
import PageShell from "@/components/page-shell";
import ImageSlot from "@/components/image-slot";
import { useCarrito } from "@/components/cart-provider";
import { useIdioma } from "@/components/lang-provider";
import { useT, LOCALES } from "@/lib/i18n";
import { CalendarDays, ShoppingBag, Trash2 } from "lucide-react";
import styles from "./carrito.module.css";

export default function CarritoPage() {
  const t = useT();
  const { idioma } = useIdioma();
  const { items, quitar, fijarPasajeros, total, totalLineas, totalPasajeros, hidratado } = useCarrito();

  const fmtFecha = (iso: string) =>
    new Date(iso).toLocaleString(LOCALES[idioma], { dateStyle: "medium", timeStyle: "short" });

  return (
    <PageShell>
      <main className={styles.page}>
        <header className={styles.heading}>
          <div>
            <span className={styles.eyebrow}>{t("nav.transporte")} · {t("nav.tours")} · {t("nav.eventos")}</span>
            <h1 className={styles.title}>{t("carrito.titulo")}</h1>
          </div>
          {hidratado && totalLineas > 0 && <span className={styles.count}>{totalLineas} · {totalPasajeros} {t("reservar.pasajeros").toLocaleLowerCase(idioma)}</span>}
        </header>

        {!hidratado ? <div className={styles.loading} aria-label={t("carrito.titulo")} /> : totalLineas === 0 ? (
          <section className={styles.empty}>
            <div className={styles.emptyMark}><ShoppingBag size={24} strokeWidth={1.5} /></div>
            <h2 className={styles.emptyTitle}>{t("carrito.vacio")}</h2>
            <p className={styles.emptyText}>{t("nav.transporte")} · {t("nav.tours")} · {t("nav.eventos")}</p>
            <div className={styles.emptyLinks}>
              <Link href="/transporte" className={`${styles.emptyLink} ${styles.emptyLinkPrimary}`}>{t("carrito.verTransporte")}</Link>
              <Link href="/tours" className={styles.emptyLink}>{t("carrito.verTours")}</Link>
              <Link href="/eventos" className={styles.emptyLink}>{t("nav.eventos")}</Link>
            </div>
          </section>
        ) : (
          <div className={styles.layout}>
            <section className={styles.items} aria-label={t("carrito.titulo")}>
              {items.map((item) => {
                const detalle = item.tipoServicio === "TRANSPORTE" ? `/transporte/${item.slug}` : `/tours/${item.slug}`;
                const categoria = item.tipoServicio === "TRANSPORTE" ? t("nav.transporte") : item.esEvento ? t("nav.eventos") : t("nav.tours");
                const totalPEN = new Intl.NumberFormat(LOCALES[idioma], { maximumFractionDigits: 2 }).format(item.precioPen * item.pasajeros);
                const totalUSD = new Intl.NumberFormat(LOCALES[idioma], { maximumFractionDigits: 2 }).format(item.precioUsd * item.pasajeros);
                return (
                  <article key={item.salidaId} className={styles.item}>
                    <Link href={detalle} className={styles.image} aria-label={item.titulo}>
                      <ImageSlot radius={8} src={item.imagen} placeholder={item.titulo} />
                    </Link>
                    <div className={styles.itemContent}>
                      <div className={styles.itemTop}>
                        <div>
                          <span className={styles.category}>{categoria}</span>
                          <Link href={detalle} className={styles.itemTitle}>{item.titulo}</Link>
                          <Link href={detalle} className={styles.detailsLink}>{item.tipoServicio === "TRANSPORTE" ? t("common.verRuta") : t("carrito.verDetalle")} →</Link>
                        </div>
                        <button type="button" onClick={() => quitar(item.salidaId)} className={styles.remove} aria-label={`${t("carrito.quitar")} ${item.titulo}`}>
                          <Trash2 size={15} aria-hidden="true" /> <span>{t("carrito.quitar")}</span>
                        </button>
                      </div>
                      <div className={styles.date}><CalendarDays size={15} aria-hidden="true" /><time dateTime={item.fechaHoraSalida}>{fmtFecha(item.fechaHoraSalida)}</time></div>
                      <div className={styles.itemBottom}>
                        <div className={styles.quantity}>
                          <span>{t("reservar.pasajeros")}</span>
                          <button type="button" aria-label="−" onClick={() => fijarPasajeros(item.salidaId, item.pasajeros - 1)}>−</button>
                          <strong>{item.pasajeros}</strong>
                          <button type="button" aria-label="+" onClick={() => fijarPasajeros(item.salidaId, item.pasajeros + 1)}>+</button>
                        </div>
                        <div className={styles.price}>S/ {totalPEN}<br />US$ {totalUSD}</div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </section>

            <aside className={styles.summary}>
              <h2 className={styles.summaryTitle}>{t("carrito.resumen")} · {totalLineas}</h2>
              <div className={styles.summaryRow}><span>{t("carrito.totalPen")}</span><strong>S/ {new Intl.NumberFormat(LOCALES[idioma], { maximumFractionDigits: 2 }).format(total("PEN"))}</strong></div>
              <div className={styles.summaryRow}><span>{t("carrito.totalUsd")}</span><strong>US$ {new Intl.NumberFormat(LOCALES[idioma], { maximumFractionDigits: 2 }).format(total("USD"))}</strong></div>
              <div className={styles.summaryTotal}><span>{t("reservar.pasajeros")}</span><span>{totalPasajeros}</span></div>
              <p className={styles.note}>{t("carrito.notaMoneda")}</p>
              <Link href="/checkout" className={styles.checkout}>{t("carrito.irCheckout")}</Link>
              <Link href="/tours" className={styles.continue}>← {t("carrito.verTours")}</Link>
            </aside>
          </div>
        )}
      </main>
    </PageShell>
  );
}
