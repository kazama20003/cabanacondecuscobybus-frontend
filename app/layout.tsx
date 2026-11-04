import { Instrument_Sans, Instrument_Serif, Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import SmoothScroll from "@/components/smooth-scroll";
import Providers from "@/components/providers";
import { requestLanguage, siteMetadata } from "@/lib/seo";

const inter = Inter({subsets:['latin'],variable:'--font-sans'});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
});

export async function generateMetadata() {
  return siteMetadata(await requestLanguage());
}

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const idioma = await requestLanguage();
  return (
    <html
      lang={idioma}
      className={cn(inter.variable, instrumentSerif.variable, "font-sans")}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `try{document.documentElement.setAttribute('data-theme',localStorage.getItem('inca-theme')||'light')}catch(e){document.documentElement.setAttribute('data-theme','light')}`,
          }}
        />
      </head>
      <body>
        <Providers initialLanguage={idioma}>
          <SmoothScroll>{children}</SmoothScroll>
        </Providers>
      </body>
    </html>
  );
}
