'use client';
import { Inter } from 'next/font/google';
import Image from 'next/image';
import './globals.css';
import { Providers } from './lib/providers';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div className={inter.className}>
          <Providers>
            <header>
              <Image
                src="/lit.svg"
                alt="Lit logo"
                width={32}
                height={32}
              ></Image>
              <a
                href="https://developer.litprotocol.com/?ref=demo.getlit.dev"
                target="_blank"
                rel="noopener nofollow"
                className="lit-cta"
              >
                Build on Lit
              </a>
            </header>
            <main className={`max-w-screen-xl mx-auto p-6 ${inter.className}`}>{children}</main>
            <footer>
              <a
                href="https://github.com/LIT-Protocol/pkp-social-auth-example"
                target="_blank"
                rel="noopener nofollow"
                className="footer-link"
              >
                View the source code
              </a>
            </footer>
          </Providers>
        </div>
      </body>
    </html>
  );
}
