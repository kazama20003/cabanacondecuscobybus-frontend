import { solicitar } from "../cliente";
import { endpoints } from "../config";
import type {
  CarritoApi,
  CheckoutCarritoApi,
  CheckoutCarritoEntrada,
  Moneda,
  TipoServicio,
} from "../tipos";

export const servicioCarritos = {
  crear: (moneda: Moneda = "PEN") =>
    solicitar<CarritoApi>(endpoints.carritos.crear, { metodo: "POST", cuerpo: { moneda } }),
  obtener: (token: string) => solicitar<CarritoApi>(endpoints.carritos.obtener(token)),
  agregarItem: (token: string, tipoServicio: TipoServicio, salidaId: string) =>
    solicitar<CarritoApi>(endpoints.carritos.agregarItem(token), {
      metodo: "POST",
      cuerpo: { tipoServicio, salidaId },
    }),
  eliminarItem: (token: string, itemId: string) =>
    solicitar<CarritoApi>(endpoints.carritos.eliminarItem(token, itemId), { metodo: "DELETE" }),
  checkout: (token: string, datos: CheckoutCarritoEntrada) =>
    solicitar<CheckoutCarritoApi>(endpoints.carritos.checkout(token), {
      metodo: "POST",
      cuerpo: datos,
    }),
};
