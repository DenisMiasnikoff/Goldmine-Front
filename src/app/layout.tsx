import type { Metadata } from "next"; // Pro-tip: Add metadata for SEO!
import { Pacifico, Lilita_One } from "next/font/google";

import Providers from "./_components/Providers";

const pacifico = Pacifico({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-logo', 
});

const lilita_one = Lilita_One({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-general',
});

export const metadata: Metadata = {
  title: "Goldmine",
  description: "Your B2B Project Portal",
};


interface RootLayoutProps {
  children: React.ReactNode;
}


export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" className={`${pacifico.variable} ${lilita_one.variable}`}>
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}