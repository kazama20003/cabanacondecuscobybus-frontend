import ContactoContenido from "./contenido";
import { metadataForStaticPage, requestLanguage } from "@/lib/seo";

export async function generateMetadata() {
  return metadataForStaticPage(await requestLanguage(), "contact", "/contacto");
}

export default function ContactoPage() {
  return <ContactoContenido />;
}
