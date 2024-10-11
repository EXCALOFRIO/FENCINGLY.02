import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from "@/components/theme-provider";
import Link from 'next/link';
import { Button } from '@/components/ui/button';


const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Fencing Tournament Management',
  description: 'Manage fencing tournaments with ease',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <header className="sticky top-0 z-50 bg-background border-b border-border"> {/* Añade un header */}
            <div className="container mx-auto flex justify-between items-center py-4 px-8">
              <Link href="/">
                <Button>Inicio</Button> {/* Botón de Inicio */}
              </Link>
                {/* Resto del contenido del header si lo necesitas*/}
            </div>
          </header>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}