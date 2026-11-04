import { metadataForListing, requestLanguage } from "@/lib/seo";

export async function generateMetadata() {
  const idioma = await requestLanguage();
  return metadataForListing(idioma, "transport", "/transporte");
}

export default function TransporteLayout({ children }: LayoutProps<"/transporte">) {
  return children;
}
