'use client';
import { Inter } from 'next/font/google';
import Image from 'next/image';
import './globals.css';
import { WagmiProvider } from 'wagmi';
import { http, createConfig } from 'wagmi';
import { mainnet, sepolia } from 'wagmi/chains';
import { injected } from 'wagmi/connectors';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StytchProvider } from '@stytch/nextjs';
import { createStytchUIClient } from '@stytch/nextjs/ui';
import { useEffect, useState } from 'react';
import { StytchUIClient } from '@stytch/vanilla-js';

const inter = Inter({ subsets: ['latin'] });

export const config = createConfig({
  chains: [mainnet, sepolia],
  connectors: [injected()],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
});

const queryClient = new QueryClient();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [stytchClient, setStytchClient] = useState<StytchUIClient | null>(
    null
  );

  useEffect(() => {
    const client = createStytchUIClient(
      process.env.NEXT_PUBLIC_STYTCH_PUBLIC_TOKEN || ''
    );
    setStytchClient(client);
  }, []);

  if (!stytchClient) {
    return null; // or a loading state
  }

  return (
    <StytchProvider stytch={stytchClient}>
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <html lang="en">
            <body className={inter.className}>
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
              <main className="max-w-screen-xl mx-auto p-6">{children}</main>
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
            </body>
          </html>
        </QueryClientProvider>
      </WagmiProvider>
    </StytchProvider>
  );
}
