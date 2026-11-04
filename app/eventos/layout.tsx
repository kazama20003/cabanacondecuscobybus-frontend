import { metadataForListing, requestLanguage } from "@/lib/seo";

export async function generateMetadata() {
  const idioma = await requestLanguage();
  return metadataForListing(idioma, "events", "/eventos");
}

export default function EventosLayout({ children }: LayoutProps<"/eventos">) {
  return children;
}
