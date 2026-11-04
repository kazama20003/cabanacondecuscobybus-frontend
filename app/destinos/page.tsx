import DestinosContenido from "./contenido";
import { metadataForListing, requestLanguage } from "@/lib/seo";

export async function generateMetadata() {
  return metadataForListing(await requestLanguage(), "destinations", "/destinos");
}

export default function DestinosPage() {
  return <DestinosContenido />;
}
