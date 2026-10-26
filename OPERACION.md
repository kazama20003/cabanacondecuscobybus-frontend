# Preparación de la tienda

Consulta `OPERACION.md` en el backend para el procedimiento operativo completo, roles, reservas, pagos, legalidad y lanzamiento.

## Entorno local

Copia `.env.example` como `.env.local` y completa `NEXT_PUBLIC_API_URL`, políticas, canales, monedas e idiomas habilitados. Los tres enlaces legales y `NEXT_PUBLIC_VERSION_POLITICAS` son obligatorios para poder enviar el checkout. La versión debe coincidir exactamente con `VERSION_POLITICAS` del backend. Canales por categoría: `NEXT_PUBLIC_CANALES_RESERVA_TRANSPORTES`, `NEXT_PUBLIC_CANALES_RESERVA_TOURS` y `NEXT_PUBLIC_CANALES_RESERVA_EVENTOS`; usa `ONLINE`, `WHATSAPP` o ambos. WhatsApp usa `NEXT_PUBLIC_WHATSAPP_RESERVAS`.

## Producción

Las variables `NEXT_PUBLIC_*` se incluyen durante `pnpm build`, así que deben estar definidas al compilar. Configura en el backend los mismos enlaces y `VERSION_POLITICAS`; la API guarda la aceptación de política y no permite reservas de producción si esos documentos faltan. Las monedas y los idiomas visibles se limitan a las listas configuradas.
