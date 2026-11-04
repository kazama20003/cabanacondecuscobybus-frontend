import NosotrosContenido from "./contenido";
import { metadataForStaticPage, requestLanguage } from "@/lib/seo";

export async function generateMetadata() {
  return metadataForStaticPage(await requestLanguage(), "about", "/nosotros");
}

export default function NosotrosPage() {
  return <NosotrosContenido />;
}
