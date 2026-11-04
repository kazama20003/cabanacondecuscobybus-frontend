import { metadataForListing, requestLanguage } from "@/lib/seo";

export async function generateMetadata() {
  const idioma = await requestLanguage();
  return metadataForListing(idioma, "tours", "/tours");
}

export default function ToursLayout({ children }: LayoutProps<"/tours">) {
  return children;
}
